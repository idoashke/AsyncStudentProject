import mongoose from "mongoose";
import {NoExpensesForUser, NoExpensesBetweenDates, NoExpensesWithCurrentCategory} from "./errors.js";
import expenses from "../routes/expenses.js";

const connection = await mongoose.connect("mongodb+srv://YonatanAvizov:Sa0725rh@moneymanger.w0mn0.mongodb.net/FrontedDB");

const Expenses = connection.model('costs', {
    user_id: {type: String}, expenses: {type: Array}, sum: {type: Number}
});


async function isCostDocExist(userId) {
    const doc = await Expenses.findOne({user_id: userId});
    if (doc == null) {
        return false;
    }
    return doc;
}

async function getAllExpensesByUserId(userId) {
    const doc = await isCostDocExist(userId);
    if ((doc === false) || (doc['expenses'].length < 1)) {
        throw new NoExpensesForUser();
    }
    return {
        "expenses": doc.toJSON()["expenses"],
        "sum": doc.toJSON()["sum"]
    };
}

async function getExpensesListFromDocs(docs) {
    const expensesList = [];
    for (let i = 0; i < docs.length; i++) {
        expensesList.push(docs[i]["expenses"]);
    }
    return expensesList;
}

async function getCurrentSumByUserId(userId) {
    const doc = await Expenses.findOne({user_id: userId});
    return doc.toJSON()["sum"];
}


async function addNewExpenseByUserId(userId, expense) {
    if (await isCostDocExist(userId) === false) {
        const doc = new Expenses({user_id: userId, expense: [], sum: 0});
        await doc.save();
    }
    let newSum = await getCurrentSumByUserId(userId);
    newSum = newSum + expense.cost;
    await Expenses.updateOne({user_id: userId}, {$push: {expenses: expense}, $set: {sum: newSum}});
}


async function getExpensesStatisticByDates(userId, startDate, endDate) {
    const sumByDates = await Expenses.aggregate([{$unwind: "$expenses"}, {
        $match: {
            user_id: userId,
            "expenses.date": {$gte: startDate, $lt: endDate}
        }
    }, {$group: {_id: null, sum: {$sum: "$expenses.cost"}}}
    ]);
    const docsByDates = await Expenses.aggregate([{$unwind: "$expenses"}, {
        $match: {
            user_id: userId,
            "expenses.date": {$gte: startDate, $lt: endDate}
        }
    }
    ]);
    if ((docsByDates == null) || docsByDates.length === 0) {
        throw new NoExpensesBetweenDates();
    }


    return {
        "number_of_expences": docsByDates.length,
        "sum_of_expenses": sumByDates[0]["sum"],
        "expenses": await getExpensesListFromDocs(docsByDates)
    };
}

async function getExpensesStatisticByCategory(userId, category) {
    const sumByCategory = await Expenses.aggregate([{$unwind: "$expenses"}, {
        $match: {
            user_id: userId,
            "expenses.category": category
        }
    }, {$group: {_id: null, sum: {$sum: "$expenses.cost"}}}
    ]);

    const docsByCategory = await Expenses.aggregate([{$unwind: "$expenses"}, {
        $match: {
            user_id: userId,
            "expenses.category": category
        }
    }
    ]);
    if ((docsByCategory == null) || docsByCategory.length === 0) {
        throw new NoExpensesWithCurrentCategory();
    }

    return {
        "number_of_expences": docsByCategory.length,
        "sum_of_expenses": sumByCategory[0]["sum"],
        "expenses": await getExpensesListFromDocs(docsByCategory)
    };
}

const User = connection.model('users', {
    user_id: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    password: {type: String},
    birthday: {type: Date},
    marital_status: {type: String}
});


async function insertNewUser(user) {
    const userDoc = new User({
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.first_name,
        password: user.password,
        birthday: user.birthday,
        marital_status: user.marital_status
    });

    await userDoc.save();

}

async function isUserExists(user_id) {
    const doc = await User.findOne({user_id: user_id});
    return doc != null;


}
async function getUserByUsername(user_id) {
    const doc = await User.findOne({user_id: user_id});
    return  doc.toJSON();
}


export {
    getAllExpensesByUserId,
    addNewExpenseByUserId,
    getExpensesStatisticByDates,
    getExpensesStatisticByCategory,
    insertNewUser,
    isUserExists,
    getUserByUsername
};