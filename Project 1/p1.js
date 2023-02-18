/*  
    PROJECT 1 - Static Website
    Name: SEBASTIAN PROSS
    Due Date: February 19, 2023
    Class: Web Application Development
    Professor: Scott Frees
*/

const http = require('http');
const url = require('url');

// Import our static data
const teams = require('./teams.json');
const all_standings = require('./standings.json');
// The two variables above are now arrays of objects.  They
// will be your data for the application.  You shouldn't have to 
// read the files again.

// Some basic lists derived from the standings.  You will probable
// find these useful when building your pages
// Make sure you take a look at what this functionality is doing - 
// the map function is incredibly helpful for transforming arrays, 
// and the use of Set and Array.from allow you to remove duplicates.

// Array.from - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
// Set - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// Array.map - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
const years = Array.from(new Set(all_standings.map(s => s.year)));
const leagues = Array.from(new Set(all_standings.map(s => s.league)));
const divisions = Array.from(new Set(all_standings.map(s => s.division)));

const send_page = (res, body) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(body);
    res.end();
}

const heading = (title) => {
    const html = `
        <!doctype html>
            <html>
                <head>
                    <title>${title}</title>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.min.css">
                </head>
                <body>
                    <a href='/'>Home</a>
                    <br/>
                    <h1>${title}</h1>
    `;
    return html;
}

const footing = () => {
    return `
        </body>
    </html>
    `;
}

//This function generates the html for the home page the yearly standings, and runs depending on how many years there is standings data for
const fill_standingsHomePage = () => {
    let accumulator_html = '';
    for(let i = 0; i < years.length; i++){
        let temp = `
            <ul>
                <li>
                    <p><a href='/standings/${years[i]}'>${years[i]} Season</a></p>
                    <ul>
                        <li>
                            <a href='/standings/${years[i]}/AL'>AL</a>
                                <ul>
                                    <li><a href='standings/${years[i]}/AL/East'>East</a></li>
                                    <li><a href='standings/${years[i]}/AL/Central'>Central</a></li>
                                    <li><a href='standings/${years[i]}/AL/West'>West</a></li>
                                </ul>
                        </li>
                        <li>
                            <a href='/standings/${years[i]}/NL'>NL</a>
                                <ul>
                                    <li><a href='standings/${years[i]}/NL/East'>East</a></li>
                                    <li><a href='standings/${years[i]}/NL/Central'>Central</a></li>
                                    <li><a href='standings/${years[i]}/NL/West'>West</a></li>
                                </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        `;
        accumulator_html = accumulator_html + temp;
    }
    return accumulator_html;
}

//Home page generation
const home_page = (res) => {
    const teams_link = '/teams'

    //Create html based on years array
    const standings_html = fill_standingsHomePage();

    const html = heading('Home') + 
    `<p><a href="${teams_link}">Teams</a></p>
    <section>
        <p>Standings</p>
    `
    + standings_html 
    + `
    </section>
    `
    + footing();
     send_page(res, html);
}

//This function generates the html for the teams page, and runs dependings on how many teams, and prints depending on information from the teams.json file
const fill_teamsPage = () => {
    let accumulator_html = `<tbody>
    `;

    for(let i = 0; i < teams.length; i++){
        let temp = `
            <tr>
                <td><img height="75" src="${teams[i].logo}"></td>
                <td>${teams[i].city}</td>
                <td>${teams[i].name}</td>
                <td>${teams[i].code}</td>
            </tr>
        `;
        accumulator_html = accumulator_html + temp;
    }
    accumulator_html += `
    </tbody>`;
    return accumulator_html;
}

//Teams page generation
const teams_page = (res) => {
    const html = heading('Teams') + `
    <table>
        <thead>
            <tr>
                <th>LOGO</th>
                <th>CITY</th>
                <th>NAME</th>
                <th>CODE</th>
            </tr>
        </thead>

    ` 
    + fill_teamsPage()
    + `</table>`
    + footing();

    send_page(res, html);
}

//This function generates the html for the yearly standings table
const fill_yearlyStandingsPage = (passedYear) => {
    //Make a new array with the standings of just the requested year
    const filteredStandings = all_standings.filter(x => x.year == passedYear);
    const sorted = filteredStandings.sort(function(team1, team2){return Number(team2.wins) - Number(team1.wins)});

    let accumulator_html = '';
    for(let i = 0; i < sorted.length; i++){
        let teamData = teams.find(x => x.code == sorted[i].team);
        let temp = `
            <tr>
                <td><img height="75" src="${teamData.logo}"></td>
                <td>${teamData.city}</td>
                <td>${teamData.name}</td>
                <td>${sorted[i].wins}</td>
                <td>${sorted[i].losses}</td>
            </tr>
        `;
        accumulator_html = accumulator_html + temp;
    }
    return accumulator_html;
}

//Yearly standings page generation
const standings_page = (res, passedYear) => {
    const title = 'Standings - ' + passedYear;
    const html = heading(title) + `
    <table>
        <thead>
            <tr>
                <th>LOGO</th>
                <th>CITY</th>
                <th>NAME</th>
                <th>WINS</th>
                <th>LOSSES</th>
            </tr>
        </thead>

    `
    + fill_yearlyStandingsPage(passedYear);
    + `</table>`
    + footing();

    send_page(res, html);
}

//This function generates the html for the league standings table
const fill_leaguesPage = (passedYear, passedLeague) => {
    //Make a new array with the standings of just the requested year and league
    const filteredStandings = all_standings.filter(x => x.year == passedYear && x.league == passedLeague);
    const sorted = filteredStandings.sort(function(team1, team2){return Number(team2.wins) - Number(team1.wins)});

    let accumulator_html = '';
    for(let i = 0; i < sorted.length; i++){
        let teamData = teams.find(x => x.code == sorted[i].team);
        let temp = `
            <tr>
                <td><img height="75" src="${teamData.logo}"></td>
                <td>${teamData.city}</td>
                <td>${teamData.name}</td>
                <td>${sorted[i].wins}</td>
                <td>${sorted[i].losses}</td>
            </tr>
        `;
        accumulator_html = accumulator_html + temp;
    }
    return accumulator_html;
}

//League standings page generation
const leagues_page = (res, passedYear, passedLeague) => {
    const title = 'Standings - ' + passedYear + ' - ' + passedLeague;
    const html = heading(title) + `
    <table>
        <thead>
            <tr>
                <th>LOGO</th>
                <th>CITY</th>
                <th>NAME</th>
                <th>WINS</th>
                <th>LOSSES</th>
            </tr>
        </thead>
    `
    + fill_leaguesPage(passedYear, passedLeague);
    + `</table>`
    + footing();

    send_page(res, html);
}

const fill_divisionsPage = (passedYear, passedLeague, passedDivision) => {
    //Make a new array with the standings of just the requested year, league, and division
    const filteredStandings = all_standings.filter(x => x.year == passedYear && x.league == passedLeague && x.division == passedDivision);
    const sorted = filteredStandings.sort(function(team1, team2){return Number(team2.wins) - Number(team1.wins)});

    let accumulator_html = '';
    for(let i = 0; i < sorted.length; i++){
        let teamData = teams.find(x => x.code == sorted[i].team);
        let temp = `
            <tr>
                <td><img height="75" src="${teamData.logo}"></td>
                <td>${teamData.city}</td>
                <td>${teamData.name}</td>
                <td>${sorted[i].wins}</td>
                <td>${sorted[i].losses}</td>
            </tr>
        `;
        accumulator_html = accumulator_html + temp;
    }
    return accumulator_html;
}

//Division standings page generation
const divisions_page = (res, passedYear, passedLeague, passedDivision) => {
    const title = 'Standings - ' + passedYear + ' - ' + passedLeague + ' - ' + passedDivision;
    const html = heading(title) + `
    <table>
        <thead>
            <tr>
                <th>LOGO</th>
                <th>CITY</th>
                <th>NAME</th>
                <th>WINS</th>
                <th>LOSSES</th>
            </tr>
        </thead>
    `
    + fill_divisionsPage(passedYear, passedLeague, passedDivision);
    + `</table>`
    + footing();

    send_page(res, html);
}

const serve = (req, res) => {
    const uri = url.parse(req.url).pathname;
    const parts = uri.split('/').splice(1);
    // parts[0] is going to be 'teams', 'standings', or '' - '' (homepage)

    // You should examine the URL to determine which page to build.
    // Each page will have the same heading part and footing - it's the contents
    // that will be different.

    // Hint:  Make one function for each page, and having it return the html
    // content, and reuse heading/footing for all of them.

    //If parts array length is only 2, then the request is the teams page
    if(req.url == '/') home_page(res);
    else if(parts.length == 1 && parts[0] == 'teams'){
        teams_page(res);
    }
    else if(parts.length >= 2 && parts[0] == 'standings'){
        //Determine which standings page to generate, based on the parts size

        if(parts.length == 3){ //Size of parts if we are looking at a specific league
            if(parts[2] == leagues[0]){
                leagues_page(res, parts[1], leagues[0]);
            }
            if(parts[2] == leagues[1]){
                leagues_page(res, parts[1], leagues[1]);
            }

        }
        else if(parts.length == 4){ //Size of parts if we are looking at a specific division in a league
            if(parts[3] == divisions[0]){
                divisions_page(res, parts[1], parts[2], divisions[0]);
            }
            if(parts[3] == divisions[1]){
                divisions_page(res, parts[1], parts[2], divisions[1]);
            }
            if(parts[3] == divisions[2]){
                divisions_page(res, parts[1], parts[2], divisions[2]);
            }
        }
        else{ //If a specific league or division was not requested, then just generate the yearly standings page
            standings_page(res, parts[1]);
        }
    }
    else{
        res.writeHead(404);
        res.end();
    }
}

http.createServer(serve).listen(3000);