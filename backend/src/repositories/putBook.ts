import {Book} from "../interface/book";
import {notifications} from "../services/notifications";
import {promises as fsPromises} from "fs";

export const putBook = async (fileBooksData: string, updatedBook: Book): Promise<void> => {
  try {
    const file = await fsPromises.readFile(fileBooksData, 'utf-8');
    const rawListBooks = JSON.parse(file);

    const indexBook: number = rawListBooks.findIndex(item => item.uuid === updatedBook.uuid);
    if (-1 !== indexBook) {
      rawListBooks[indexBook] = {...rawListBooks[indexBook], ...updatedBook};
      await fsPromises.writeFile(fileBooksData, JSON.stringify(rawListBooks, null, 2), 'utf-8');

      notifications(`edit/${updatedBook.uuid}`, 'info', `“${updatedBook.title}” by ${updatedBook.author} have been updated.`, updatedBook);
    }
  } catch (err) {
    throw new Error(`Error cant update book "${updatedBook.uuid}": ${err}`);
  }
}
