var jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
/**
 * It takes an id as an argument and returns a token that expires in 24 hours
 * @param {Number} - The user's id
 * @returns A token is being returned.
 */
const createToken = (id) => {
  const payload = { id: id.toString() };
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: maxAge,
  });
};
/* A constant that holds the mailtrap credentials. */
const mailData = {
  service: "gmail",
  auth: {
    user: process.env.USERNAME,
    pass: process.env.PASS,
  },
};
async function generateData(numEntries) {
  const categories = [
    "6444c505caeba826785fa092",
    "6444c505caeba826785fa093",
    "6444c505caeba826785fa094",
    "6444c505caeba826785fa095",
    "6444c505caeba826785fa096",
    "6444c505caeba826785fa097",
    "6444c505caeba826785fa098",
    "6444c505caeba826785fa099",
    "6444c505caeba826785fa09a",
    "6444c505caeba826785fa09b",
    "6444c505caeba826785fa09c",
    "6444c505caeba826785fa09d",
    "6444c505caeba826785fa09e",
    "6444c505caeba826785fa09f",
    "6444c505caeba826785fa0a0",
    "6444c505caeba826785fa0a1",
    "6444c505caeba826785fa0a2",
    "6444c505caeba826785fa0a3",
    "6444c505caeba826785fa0a4",
    "6444c505caeba826785fa0a5"
];
  const transfers = [
    "Electric Company",
    "Client A",
    "Supermarket",
    "Cellular Provider",
    "Landlord",
    "Restaurant",
    "Acme Corporation",
    "Gas Station",
    "Fitness Center",
    "Online Retailer",
    "Auto Finance Co.",
    "Employer",
    "Dentist",
    "Internet Provider",
    "Vacation Rental Co.",
    "Retail Store",
    "Movie Theater",
    "Charity Organization",
    "Jon Doe",
    "Jane Smith",
    "Mark Johnson",
    "Jessica Lee",
    "David Kim",
    "Sarah Davis",
    "Mike Brown",
    "Amy Chen",
    "James Rodriguez",
    "Linda Wilson",
    "Thomas Jones",
    "Emily Taylor",
    "Juan Martinez",
    "Jennifer Garcia",
    "Ryan Nguyen",
    "Julia Perez",
    "Brandon Taylor",
    "Vanessa Rodriguez",
    "Scott Miller",
    "Megan Hernandez",
    "Daniel Davis",
    "Catherine Kim",
    "Christopher Lee",
    "Melissa Garcia",
    "Joshua Lee",
    "Laura Davis",
    "Kevin Wilson",
    "Samantha Brown",
    "Erica Perez",
    "Michael Chen",
    "Maria Martinez",
    "Eric Johnson",
    "Angela Lee",
    "Kyle Brown",
    "Anna Kim",
    "Patrick Taylor",
    "Katherine Rodriguez",
    "Steven Miller",
    "Madison Davis",
    "Brian Martinez",
    "Allison Hernandez",
    "Jordan Lee",
    "Ashley Wilson",
    "Andrew Perez",
    "Rebecca Johnson",
    "Samuel Brown",
    "Michelle Kim",
    "Joseph Davis",
    "Christina Lee",
    "Nathan Rodriguez",
    "Hannah Hernandez",
    "Benjamin Martinez",
    "Alyssa Taylor",
    "Nicholas Wilson",
    "Stephanie Brown",
    "Ethan Perez",
    "Olivia Johnson",
    "Grace Kim",
    "Tyler Davis",
    "Lauren Lee",
    "Isabella Rodriguez",
    "David Hernandez",
    "Emma Martinez",
    "Christopher Taylor",
    "Amanda Wilson",
    "Jacob Brown",
    "Sophia Perez",
    "William Johnson",
    "Victoria Kim",
    "Christopher Davis",
    "Abigail Lee",
    "Emily Rodriguez",
    "Alex Hernandez",
    "Daniel Martinez",
    "Lauren Taylor",
    "John Wilson",
    "Julia Brown",
    "Jacob Perez",
    "Elizabeth Johnson",
    "Gabriel Kim",
    "Mia Davis",
    "Nicholas Lee",
    "Natalie Rodriguez",
    "Jasmine Hernandez",
    "Gabriella Martinez",
    "Christian Taylor",
    "Chloe Wilson",
    "Elijah Brown",
    "Avery Perez",
    "Liam Johnson",
    "Sophie Kim",
    "Caleb Davis",
    "Emma Lee",
    "Zoe Rodriguez",
    "Anthony Hernandez",
    "Hailey Martinez",
    "Brianna Taylor",
    "Daniel Wilson",
    "Madeline Brown",
    "Sydney Perez",
    "Samuel Johnson",
    "Makayla Kim",
    "Austin Davis",
    "Jocelyn Lee",
    "Leah Rodriguez",
    "Diego Hernandez",
    "Julian Martinez",
    "Brooklyn Taylor",
    "Natalia Wilson",
    "Isabelle Brown",
    "Aaliyah Perez",
    "Isaac Johnson",
    "Alexa Kim",
    "Cameron Davis",
    "Madelyn Lee",
    "Caroline Rodriguez",
    "Kaylee Hernandez",
    "Maxwell Martinez",
    "Adrian Taylor",
    "Riley Wilson",
    "Tristan Brown",
    "Jenna Perez",
    "Adam Johnson",
    "Ava Kim",
    "Mason Davis",
    "Makenna Lee",
    "Kennedy Rodriguez",
    "Landon Hernandez",
    "Miguel Martinez",
    "Avery Taylor",
  ];
  const transactions = [
    "Grocery shopping",
    "Phone bill payment",
    "Rent payment",
    "Dentist appointment",
    "Salary payment",
    "Movie ticket purchase",
    "Car fuel refill",
    "Electricity bill payment",
    "Gym membership fee",
    "Online purchase",
    "Restaurant dinner",
    "Coffee shop visit",
    "Clothing purchase",
    "Haircut appointment",
    "Flight ticket booking",
    "Hotel reservation",
    "Charity donation",
    "Gift purchase",
    "Music concert ticket",
    "Sporting event ticket",
    "Amazon shopping",
    "Netflix subscription",
    "Home insurance premium",
    "School tuition fee",
    "Doctor consultation fee",
    "Fitness class registration",
    "Car insurance premium",
    "Mobile phone upgrade",
    "House cleaning service",
    "Stock investment",
  ];

  let data = { data: [] };

  for (let i = 0; i < numEntries; i++) {
    let category = await categories[
      Math.floor(Math.random() * categories.length)
    ];
    let transfer = await transfers[
      Math.floor(Math.random() * transfers.length)
    ];
    let amount = await parseFloat(Math.random() * 10000 - 5000).toFixed(2);
    let text =
      (await transactions[Math.floor(Math.random() * transactions.length)]) +
      "#" +
      (Math.floor(Math.random() * 100) + 1);
    let entry = {
      text: text,
      amount: amount,
      transfer: transfer,
      category: category,
    };
    data["data"].push(entry);
  }

  return data;
}
function generateRandomNames(numNames) {
  const vowels = ["a", "e", "i", "o", "u"];
  const consonants = [
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "q",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const names = [];

  for (let i = 0; i < numNames; i++) {
    let name = "";
    const nameLength = Math.floor(Math.random() * 6) + 5; // Generate a name length between 5 and 10 characters

    // Generate the name by alternating between a random consonant and vowel
    for (let j = 0; j < nameLength; j++) {
      if (j % 2 === 0) {
        name += consonants[Math.floor(Math.random() * consonants.length)];
      } else {
        name += vowels[Math.floor(Math.random() * vowels.length)];
      }
    }

    names.push(name);
  }

  return names;
}

module.exports = { createToken, mailData, generateData, generateRandomNames };
