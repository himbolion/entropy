import server from "./src/utils/server.ts";
import { nanoid } from "./deps.ts";
import CONFIG from "./config.ts";
import Database from "./src/utils/database.ts";

Deno.mkdir(CONFIG.ENTROPY_IMAGES, { recursive: true })
    .catch(e => console.error(`${CONFIG.ENTROPY_IMAGES} exists.`))
// .then(e => console.log(`${CONFIG.ENTROPY_IMAGES} created.`))

console.log("[Entropy] online");
console.log(CONFIG)
type files = {
    [key: string]: Blob;
};

server.post("/upload", (req: { files: files }) => {
    // console.log("image upload :eyes:");

    let files: files = req.files;
    //await console.log(files)

    const mappedFiles = Object.entries(files).map(([name, blob]) => ({
        name: nanoid(15),
        file: name,
        ext: name.split(".").pop(),
        data: blob,
    }));

    mappedFiles.forEach(async (file) => {
        let data = new Uint8Array(await file.data.arrayBuffer());

        console.log(`${CONFIG.ENTROPY_IMAGES}/${file.name}.${file.ext}`)
        await Database.insertOne({
            file: file.file,
            name: file.name,
            ext: file.ext
        })
        await Deno.writeFile(
            `${CONFIG.ENTROPY_IMAGES}/${file.name}.${file.ext}`,
            data,
            { create: true },
        );
    });
    //await Deno.writeFile(newProfilePicture.name, new Uint8Array(await newProfilePicture.arrayBuffer()));

    return "Uploaded!";
});
