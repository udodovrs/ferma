const {
  mkdir,
  writeFile,
  readdir,
  readFile,
  unlink,
} = require("node:fs/promises");
const { join } = require("node:path");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");

class DB {
  constructor(nameColection) {
    this._nameColection = nameColection;
    this.instanceMethod();
  }

  async instanceMethod() {
    const projectFolder = join(__dirname, this._nameColection);
    await mkdir(projectFolder, { recursive: true });
  }

  async create(id, data) {
    //const id = uuidv4();
    const user = { id, ...data };
    const userStringifyed = JSON.stringify(user, null, 2);
    const pathNewFile = join(__dirname, this._nameColection, id + ".json");
    try {
      await writeFile(pathNewFile, userStringifyed, {
        flag: "wx",
      });
      return userStringifyed;
    } catch (e) {
      console.error(e.message);
      return "Failed to create a record";
    }
  }

  async getAllcolection() {
    const pathDir = join(__dirname, this._nameColection);
    const result = [];
    try {
      const files = await readdir(pathDir);
      for (const item of files) {
        const pathFile = join(pathDir, item);
        const content = await readFile(pathFile);
        const obj = JSON.parse(content);
        result.push(obj);
      }
      return result;
    } catch (e) {
      console.error(e.message);
      return e.message;
    }
  }

  async getElemnt(id) {
    const pathFile = join(__dirname, this._nameColection, id + ".json");
    try {
      const content = await readFile(pathFile);
      const str = content.toString();
      return JSON.parse(str);
    } catch (e) {
      console.error(e.message);
      return false;
    }
  }

  async updateElement(id, data) {
    const pathFile = join(__dirname, this._nameColection, id + ".json");

    try {
      const content = await readFile(pathFile);
      //const obj = JSON.parse(content);
      const updateObj = { ...data };
      const stringifyedObj = JSON.stringify(updateObj, null, 2);
      await writeFile(pathFile, stringifyedObj, {
        flag: "w+",
      });

      return stringifyedObj;
    } catch (e) {
      console.error(e.message);
      return false;
    }
  }

  async updatePartElement(id, data) {
    const pathFile = join(__dirname, this._nameColection, id + ".json");

    try {
      const content = await readFile(pathFile);
      const obj = JSON.parse(content);
      const updateObj = { ...obj, ...data };
      const stringifyedObj = JSON.stringify(updateObj, null, 2);
      await writeFile(pathFile, stringifyedObj, {
        flag: "w+",
      });

      return stringifyedObj;
    } catch (e) {
      console.error(e.message);
      return false;
    }
  }

  async deleteElement(id) {
    const pathFile = join(__dirname, this._nameColection, id + ".json");
    if (!uuidValidate(id)) {
      return "Unsuitable id format";
    }
    try {
      await unlink(pathFile);
      return "The item has been deleted";
    } catch (e) {
      console.error(e.message);
      return "No results";
    }
  }
}

module.exports = DB;
