/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const {
  generateData,
  generateRandomNames,
  calculatePercentageChange,
  expenssPrCalc,
} = require("../utils");

module.exports = {
  /**
   * GET /viewTransaction/:id
   *
   *
   * @description function getting the transactions of a specific account.
   * @param {Number} req - find transaction by id
   * @return {view} res - render "pages/homepage"
   * @rejects {Error} - If failed log error
   */
  getTrsansaction: async (req, res) => {
    try {
      const accountId = req.params.id;
      console.log(accountId);
      if (!accountId) {
        return res.status(404).json({ message: "account id required" });
      }
      const account = await Accounts.findOne({ id: accountId });
      const transactionsData = await Transaction.find({
        account: accountId,
      })
        .populate("updatedBy")
        .populate("category")
        .sort([
          {
            createdAt: "DESC",
          },
        ]);

      let cuurentIncome = 0;
      let currentExpens = 0;
      let totalBalance = 0;
      transactionsData.forEach((element) => {
        if (element.amount > 0) {
          cuurentIncome += element.amount;
        } else {
          currentExpens += Math.abs(element.amount);
        }
        totalBalance += element.amount;
      });

      const finalData = {
        data: transactionsData,
        balance: totalBalance.toFixed(2),
        income: cuurentIncome.toFixed(2),
        incomePercentageChange: account.incomePercentage.toFixed(2),
        expensePercentageChange: account.expensesPercentage.toFixed(2),
        expenses: currentExpens.toFixed(2),
        accountId,
        nameAccount: account.name,
      };

      return res.json(finalData);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * GET /viewTransaction/:id
   * @description function getting the transactions of a specific account.
   * @param {Number} req - find transaction by id
   * @return {view} res - render "pages/homepage"
   * @rejects {Error} - If failed log error
   */
  addTrsansaction: async (req, res) => {
    try {
      const tID = req.params.tId;
      const { text, amount, transfer, category } = req.body;
      if (req.body.data) {
        req.body.data.forEach(async (element) => {
          await Transaction.create({
            text: element.text,
            amount: element.amount,
            transfer: element.transfer,
            category: element.category,
            by: req.user.id,
            updatedBy: req.user.id,
            account: tID,
          });
        });
        return res.status(201).json({ message: "success" });
      }

      if (!req.user.id) {
        return res.status(404).json({ message: "User not Loggedin" });
      }
      if (!tID) {
        return res.status(404).json({ message: "transaction id required" });
      }

      if (!text || !amount || !transfer || !category) {
        return res.status(404).json({ message: "All fields are required" });
      }

      // console.log(text, amount);
      const newTransactions = await Transaction.create({
        text,
        amount,
        transfer,
        category,
        by: req.user.id,
        updatedBy: req.user.id,
        account: tID,
      });

      const currentIcomeExp = await Transaction.find({
        account: tID,
      });

      let cuurentIncome = 0;
      let currentExpens = 0;
      let totalBalance = 0;
      currentIcomeExp.forEach((element) => {
        if (element.amount > 0) {
          cuurentIncome += element.amount;
        } else {
          currentExpens += Math.abs(element.amount);
        }
        totalBalance += element.amount;
      });

      const cuurentBalanceData = await Accounts.findOne({ id: tID });
      console.log("====================================");
      console.log(cuurentBalanceData);
      console.log("====================================");
      if (amount > 0) {
        console.log("invome update");
        const incomeChange = calculatePercentageChange(
          cuurentIncome,
          cuurentBalanceData.previousIncome
        );

        await Accounts.updateOne({ id: tID }).set({
          previousIncome: cuurentIncome,
          balance: totalBalance,
          incomePercentage: incomeChange,
        });
        return res.status(201).json({ data: newTransactions });
      } else {
        const expensesChange = expenssPrCalc(
          currentExpens,
          cuurentBalanceData.previousExpenses
        );

        await Accounts.updateOne({ id: tID }).set({
          previousExpenses: currentExpens,
          balance: totalBalance,
          expensesPercentage: expensesChange,
        });
        return res.status(201).json({ data: newTransactions });
      }
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  addLargeGeneratedTransaction: async (req, res) => {
    try {
      const dataLength = req.body.qnty;
      const tID = req.params.tId;
      const currentUser = req.user.id;
      if (!tID) {
        return res.status(404).json({ message: "account id required" });
      }
      const isValid = await Accounts.findOne({ id: tID });
      if (!isValid) {
        return res.status(404).json({ message: "account not found" });
      }
      if (!dataLength) {
        return res.status(404).json({ message: "qnty field required" });
      }
      const { data } = await generateData(dataLength, tID, currentUser);
      await Transaction.createEach(data);

      const cuurentBalanceData = await Accounts.findOne({ id: tID });
      console.log("====================================");
      console.log(cuurentBalanceData);
      console.log("====================================");
      data.forEach(async (element) => {
        const currentIcomeExp = await Transaction.find({
          account: tID,
        });

        let cuurentIncome = 0;
        let currentExpens = 0;
        let totalBalance = 0;
        currentIcomeExp.forEach((element) => {
          if (element.amount > 0) {
            cuurentIncome += element.amount;
          } else {
            currentExpens += Math.abs(element.amount);
          }
          totalBalance += element.amount;
        });

        if (element.amount > 0) {
          const incomeChange = calculatePercentageChange(
            cuurentIncome,
            cuurentBalanceData.previousIncome
          );

          await Accounts.updateOne({ id: tID }).set({
            previousIncome: cuurentIncome,
            balance: totalBalance,
            incomePercentage: incomeChange.toFixed(2),
          });
        } else {
          const expensesChange = expenssPrCalc(
            currentExpens,
            cuurentBalanceData.previousExpenses
          );

          console.log("====================================");
          console.log("expense update", expensesChange);
          console.log("====================================");
          await Accounts.updateOne({ id: tID }).set({
            previousExpenses: currentExpens,
            balance: totalBalance,
            expensesPercentage: expensesChange.toFixed(2),
          });
        }
      });
      return res.status(201).json({ message: "success" });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  generateDataForTrans: async (req, res) => {
    try {
      const dataLength = req.body.qnty;
      if (!dataLength) {
        return res.status(404).json({ message: "qnty field required" });
      }
      const data = await generateData(parseInt(dataLength));
      return res.json(data);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  generateNames: async (req, res) => {
    try {
      const dataLength = req.body.qnty;
      if (!dataLength) {
        return res.status(404).json({ message: "qnty field required" });
      }
      const data = await generateRandomNames(dataLength);
      return res.json(data);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  /**
   * GET /editTransaction/:id
   * @description function getting the transactions and render editTransaction page.
   * @param {Number} req - find transaction by id
   * @return {view} res - render "pages/editTransaction"
   * @rejects {Error} - If failed log error
   */
  editTransaction: async (req, res) => {
    const tId = req.params.id;
    try {
      const transactions = await Transaction.findOne({ id: tId }).populate(
        "category"
      );
      return res.json({ data: transactions });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  /**
   * POST /editTransaction/:id
   * @description function update transaction data and redirect to home page
   * @param {Number} req - find transaction by id
   * @return {redirect} - redirect to  "/"
   * @rejects {Error} - If failed log error
   */
  updateTransaction: async (req, res) => {
    const tId = req.params.id;
    try {
      if (!tId) {
        return res.status(404).json({
          message: "Transaction id not found",
        });
      }
      const criteria = { id: tId };
      const values = req.body;

      if (!values) {
        return res.status(404).json({
          message: "Atleast one field required",
        });
      }
      // console.log(criteria, values);
      const updatedTransaction = await Transaction.updateOne(criteria).set({
        ...values,
        updatedBy: req.user.id,
      });

      const cuurentBalanceData = await Accounts.findOne({
        id: updatedTransaction.account,
      });

      if (updatedTransaction.amount > 0) {
        await Accounts.updateOne({ id: tID }).set({
          previousIncome:
            cuurentBalanceData.previousIncome + updatedTransaction.amount,
        });
        return res.status(201).json({ data: newTransactions });
      } else {
        await Accounts.updateOne({ id: accountId }).set({
          previousExpenses:
            cuurentBalanceData.previousExpenses +
            Math.abs(updatedTransaction.amount),
        });
        return res.status(201).json({ data: newTransactions });
      }
      return res.json({ data: updatedTransaction });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  /**
   * /rmTransaction/:delId
   * @description function delete transaction data and redirect to viewTransaction page
   * @param {Number} req - find transaction by id
   * @param {Object} req - accId from req.body
   * @return {redirect} - redirect to  "/viewTransaction/${accID}"
   * @rejects {Error} - If failed log error
   */
  rmTransaction: async (req, res) => {
    try {
      const transId = req.params.delId;

      console.log(transId);

      if (!transId) {
        return res.status(404).json({
          message: "Transaction id not found",
        });
      }

      const isValid = await Transaction.findOne({ id: transId });

      if (!isValid) {
        return res.status(404).json({
          message: "Transaction id not valid",
        });
      }
      await Transaction.destroy({ id: transId });
      return res.status(200).json({ message: "Transaction deleted" });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  rmAllTransaction: async (req, res) => {
    const accountId = req.params.accId;
    if (!accountId) {
      return res.status(404).json({ message: "account not found" });
    }
    try {
      await Transaction.destroy({ account: accountId });
      await Accounts.updateOne({ id: accountId }).set({
        previousIncome: 0,
        previousExpenses: 0,
        balance: 0,
        incomePercentage: 0,
        expensesPercentage: 0,
      });
      return res.status(200).json({ message: "Transaction deleted" });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
};
