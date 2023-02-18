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
    const demo_site = `https://jaedenalpizar.cargo.site/`;

    //Create html based on years array
    const standings_html = fill_standingsHomePage();

    const html = heading('Home') + 
    `<p>Click <a href="${demo_site}">here</a> to look at some cool photos!</p>
    <p><a href="${teams_link}">Teams</a></p>
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

const standings_page = (res) => {
    const html = heading('Standings') + `
    <p>Standings page test</p>
    ` 
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
        standings_page(res);
    }
    else{
        res.writeHead(404);
        res.end();
    }
}


http.createServer(serve).listen(3000);