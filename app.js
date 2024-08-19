import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import Movie from "./modules/movie.js";
import fs from "fs";

const app = express();
const port = 3000;

// Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },

    // Define uploaded img data
    filename: (req, file, cb) => {
        const { title, year } = req.body;

        // Get file extension from file's original name
        const fileOriginalName = file.originalname;
        const i = fileOriginalName.lastIndexOf(".");
        const fileExtension = fileOriginalName.substring(i);

        // Compose Final name
        cb(null, title + '-' + year + "" + fileExtension);
    }
});

// File types validation
const upload = multer({
    storage: storage,
    // limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// Database
var dbUrl = "./database/collection.json";

// App usage:
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");


// Render Main Page
app.get("/", async (req, res) => {
    try {
        const collection = await readDatabase();
        collection.sort((a, b) => a.title > b.title ? 1 : -1);
        res.render("index.ejs", { collection });
    } catch (error) {
        console.error("Error rendering main page: ", error);
        res.status(500).send("Error rendering main page");
    }
});


// Search movie
app.get("/search", async (req, res) => {
    try {
        const movies = await readDatabase();
        const query = req.query.q.toLowerCase();
        const results = movies.filter(movie =>
            movie.title.toLowerCase().includes(query) ||
            movie.director.toLowerCase().includes(query) ||
            movie.actors.some(actor => actor.toLowerCase().includes(query)) ||
            movie.year.includes(query)
        );
        res.json(results);
    } catch (error) {
        console.error("Error searching database: ", error);
        res.status(500).send("Error searching database");
    }
});



// Render Add Movie Page
app.get("/add", (req, res) => {
    res.render("add.ejs");
});

// Add new movie
app.post("/add", upload.single('image'), async (req, res) => {
    try {
        // Create movie object
        const image = req.file;
        const id = uuidv4();
        const { title, director, actors, year } = req.body;
        const actorsArr = actors.split(",");

        const movie = new Movie(id, title, director, actorsArr, year, image);

        // Call add data function
        await addDataToDb(movie, dbUrl);
        res.status(200).redirect("/");
    } catch (error) {
        console.error("Error posting data: ", error);
        res.status(500).send("Error posting data");
    }
});

// Add data to DB
async function addDataToDb(element, db) {
    try {
        const data = await readDatabase();

        if (!Array.isArray(data)) {
            throw new Error("Database is undefined!");
        }

        data.push(element);

        const dataToDb = JSON.stringify(data, null, 2);

        await fs.promises.writeFile(db, dataToDb);

        console.log("Movie successfuly added to database!");
    } catch (error) {
        console.error("Unable to add Movie to database: " + error);
    }
};

// Remove movie
app.post("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await removeMovie(id, dbUrl);
        res.status(200).redirect("/");

    } catch (error) {
        console.error("Error deleting movie: ", error);
        res.status(500).send("Error deleting movie");
    }
});

// Remove movie function
async function removeMovie(id, db) {
    try {
        let data = await readDatabase();
        const movieToDelete = data.find(movie => movie.id === id);

        // Check if image was uploaded
        const imagePath = movieToDelete.image ? movieToDelete.image.path : null;

        // Delete movie from database by filtering all data but without specific id
        data = data.filter(movie => movie.id !== id);

        // Delete the image file
        if (fs.existsSync(imagePath)) {
            await fs.promises.unlink(imagePath);
            console.log("Image file successfully deleted!");
        } else {
            console.error("Image file not found:", imagePath);
        }

        // Write renewed data to database
        const editedData = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(db, editedData);
        console.log("Movie deleted!");
    } catch (error) {
        console.error("Unable to delete movie: ", error);
        res.status(500).send("Unable to delete movie");
    }
};

// Read Database
async function readDatabase() {
    try {
        const movieCollection = await fs.promises.readFile(dbUrl, "utf8");
        const collectionData = await JSON.parse(movieCollection);
        console.info("Database data: ", collectionData);
        return collectionData;
    } catch (error) {
        console.error("Unable to read from databse. " + error);
        return [];
    }
};




// Server listens the port
app.listen(port, () => {
    console.log(`Server successfully runs on port ${port}...`);
});