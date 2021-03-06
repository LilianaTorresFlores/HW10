const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

var questionsCommon = [
    {
        type: 'input',
        message: 'ID:',
        name: 'id',
    },
    {
        type: 'input',
        message: 'Name:',
        name: 'name',
    },
    {
        type: 'input',
        message: 'Email:',
        name: 'email',
    },
]

var questionsManager = [
    {
        type: 'input',
        message: 'Office Number:',
        name: 'officeNumber',
    }
]

var questionsIntern = [
    {
        type: 'input',
        message: 'School:',
        name: 'school',
    }
]

var questionsEngineer = [
    {
        type: 'input',
        message: 'Github username:',
        name: 'github',
    }
]

var teamMembers = [];

function askForInformation() {
    inquirer.prompt([
        {
            type: 'list',
            message: "Role of employee",
            name: 'role',
            choices: ["Intern", "Engineer"]
        }
    ]).then(
        function(response) {
            var role = response.role;
            var questions;
            if(role == "Intern") {
                questions = questionsCommon.concat(questionsIntern);
            }else{
                questions = questionsCommon.concat(questionsEngineer);
            }
            inquirer.prompt(questions).then(
                function(response) {
                    var employee;
                    if(role == "Intern"){
                        employee = new Intern(response.name, response.id, response.email, response.school);
                    }else{
                        employee = new Intern(response.name, response.id, response.email, response.github);
                    }
                    teamMembers.push(employee);
                    inquirer.prompt({
                        type: 'confirm',
                        message: 'Do you wish to add another employee?',
                        name: 'another'
                    }).then(function(response){
                        if(response.another){
                            askForInformation();
                        }else{
                            saveHtml();
                        }
                    })
                }
            )
        }
    )
}

console.log("Manager information");
inquirer.prompt(questionsCommon.concat(questionsManager)).then(
    (response) => {
        var manager = new Manager(response.name, response.id, response.email, response.officeNumber);
        teamMembers.push(manager);
        console.log("Team information");
        askForInformation();
    }
)

function saveHtml() {
    var html = render(teamMembers);
    fs.writeFile(outputPath, html, (err) =>
        err ? console.error(err) : console.log('HTML written. Success!')
    );
}