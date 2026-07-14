# Identify record issues tool - Clean up scheme - Pensions - NHSBSA
Visit the prototype, <a href="https://clean-up-dropped-employments-f2ad7b1582d8.herokuapp.com/">past and current versions</a> 

# About Identify record issues
Identify record issues is an online tool used to detect corruptions in pensions records. Users can search for members and video data being pulled live from Compendia, the data sets highlight any corruptions that have been found within the tables and offer the user guidance on how they can be fixed. The tool does not currently detect every corruption, new corruptions and enhancements are added with each release.

# Phase
The prototype is currently in Beta and continuously being iterated upon to enhance and expand the tool and its functionality.

# Tech stack
Node.js, NHS.UK Frontend, NHS.UK Prototype Kit, Nunjucks, HTML, CSS, JavaScript

Identify record issues uses a lot of js to ensure all of the features work inline with each other, there are js files for each of the features so they can be turned on and off depending on the prototype version being worked on.

The layout.html file holds a lot of content/code which is used frequently throughout multiple prototypes. This includes data tables and content for the pensions issue overview. All content is held within sets which are then pulled into the relevant places within the html files.

# Prototype disclaimer
This is a live project and currently being worked on iteratively and may contain incomplete functionality.

The data held within the data sets is static and does not update on browser refresh, this functionality will only be visible in the live version. The search within the prototype is for design purposes any number can be entered into here to reach the results screen.

# Installation instructions

- <a href="https://prototype-kit.service-manual.nhs.uk/install/simple">Install guide (non technical)</a>
- <a href="https://prototype-kit.service-manual.nhs.uk/install/advanced">Developer friendly install guide (technical)</a>

# Running the kit
Start the kit with `npm start`.

# Making changes
Merge required changes via pull requests into `main` branch. As you do so, document changes in the `CHANGELOG.md` under an 'Unreleased' header at the top.

