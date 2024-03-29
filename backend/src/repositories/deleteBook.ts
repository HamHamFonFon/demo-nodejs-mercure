import {promises as fsPromises} from "fs";
import {notifications} from "../services/notifications";

/**
 * Delete Book
 *
 * @param fileBooksData
 * @param uuid
 */
export const deleteBook = async (fileBooksData: string, uuid: string): Promise<void> => {
  try {
    // Read file
    const file = await fsPromises.readFile(fileBooksData, 'utf-8');
    const rawListBooks = JSON.parse(file);

    // Get index
    const indexBook: number = rawListBooks.findIndex(item => item.uuid === uuid);
    const bookToDelete = rawListBooks.find(item => item.uuid === uuid);
    if (-1 !== indexBook) {
      // Remove item and write into JSON
      rawListBooks.splice(indexBook, 1);
      await fsPromises.writeFile(fileBooksData, JSON.stringify(rawListBooks, null, 2), 'utf-8');
      notifications('delete', 'error', `Book ${uuid} have been removed from list.`, bookToDelete);
    }
  } catch (err: unknown) {
    throw new Error((err as Error).message);
  }
}
