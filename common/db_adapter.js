import mongoose from "mongoose";
import {NoExpensesForUser} from "./errors.js";

const connection = await mongoose.connect("mongodb+srv://admin:Password1@cluster0.umbnu.mongodb.net/expenses_tracker_app")
const Expenses = connection.model('costs', {
    user_id: {type: String}, expenses: {type: Array}, sum: {type: Number}
})

async function get_all_expenses_by_user_id(user_id) {
    const doc = await Expenses.findOne({user_id: user_id});
    if (doc == null) {
        throw new NoExpensesForUser()
    }
    //TODO: if we add a delete expense so we need to add here a check for expenses array len
    return doc.toJSON()["expenses"]
}


export {get_all_expenses_by_user_id}