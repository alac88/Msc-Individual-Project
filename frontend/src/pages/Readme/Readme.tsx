import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './Readme.scss';

function Readme() {


    return (
        <div className="container">
            <h1>Readme</h1>
      
            <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography className="title">1. Use the search bar</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                    <div className="stepContainer">
                        <span className="info">If you do not intend to use the search bar, go directly to Step 2.</span>
                        <img src="img/searchbar.png" className="big"/>
                        The searchbar has different components, that you are free to use or not. You can use it to narrow down the list of fetched apps.
                        <ol>
                            <li className="stepContainer no-border">
                                <span>
                                    <strong>App name or package name</strong>
                                    <img src="img/searchbar_name.png" className="small"/>
                                    <p>This field enables to search an app by name or package name. A partial name can be provided. If the name provided matches with multiples apps, they will all be displayed.</p>
                                </span>
                            </li>
                            <li className="stepContainer no-border">
                                <span>
                                    <strong>Category</strong>
                                    <img src="img/searchbar_categories.png" className="small"/>
                                    <p>A list of categories is suggested when you click on this field. This will select all apps from a certain category.</p>
                                </span>
                            </li>
                            <li className="stepContainer no-border">
                                <span>
                                    <strong>Ratings</strong>
                                    <img src="img/searchbar_ratings.png" className="small"/>
                                    <p>This slider enables search by ratings. All apps which have a higher rating than the provided one will be displayed.</p>
                                </span>
                            </li>
                            <li className="stepContainer no-border">
                                <span>
                                    <strong>Max</strong>
                                    <img src="img/searchbar_max.png" className="small"/>
                                    <p>You don't want to fetch too many apps? This parameter will set a limit to the number of apps to fetch.</p>
                                </span>
                            </li>
                        </ol>
                    </div>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography className="title">2. Select apps</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                    <div className="stepContainer">
                        Once the list of apps is fetched, you can select one or more apps for a security analysis. Selection will be indicated by the checkbox next to the corresponding Card.
                        <img src="img/card_selected.png" className="big"/>
                    </div>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography className="title">3. Run the analysis</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                    <div className="stepContainer">
                        You can select the type of analysis you want to perform, by using the selection below:
                        <img src="img/run_analysis.png" className="medium"/>
                        So far, you have the choice between:
                        <ul>
                            <li>Pre-static;</li>
                            <li>Static;</li>
                            <li>Both.</li>
                        </ul>
                        An additionnal permissions analysis will be performed in any case.
                        Depending on the number of apps checked, the Compare button will be disabled or activated, with a different value as showed below:
                        <img src="img/compare_button.png" className="medium"/>
                        Click on it to run the analysis!
                    </div>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography className="title">4. Interpret the analysis</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                    <div className="stepContainer">
                        The analysis will be performed live, and might take a bit of time, so be patient! <br/>
                        A loader will be displayed in the header of the pop up modal to indicate that the analysis is still going on. Results will be 
                        fetched progressively will the analysis is running.
                        At the end, quite a lot of results will be displayed, so let's go through them together.<br/><br/>

                        In the case where you only selected one app, its metadata will be present at the beginning:
                        <img src="img/metadata.png" className="big"/>

                        Then, depending on the type of analysis you selected, the following results might or not be displayed. For the sake of simplification,
                        the screenshots below will illustrate the case where both analysis have been selected:
                        <img src="img/topModal.png" className="big"/>

                        The first table gathers security scores for every selected app. Three scores are first computed for each analysis, and the last one is then calculated with them.
                        The details of how they are computed is given in the Report.

                        The second table is the permissions analysis, which list the permissions in the AndroidManifest.xml file of each file.

                        <img src="img/bottomModal.png" className="big"/>

                        The table at the top is the VirusTotal analysis, which displays all the antivirus that have been use to perform a security analysis on the apk files. Three cases are to be found:
                        <ul>
                            <li>The cell is empty: the corresponding antivirus has not found any security issue.</li>
                            <li>The cell value is "NaN": the antivirus has not been used on the corresponding apk.</li>
                            <li>The cell is checked: an anomaly has been found.</li>
                        </ul>

                        Finally, the table at the bottom is the FlowDroid analysis, which lists the number of sources/sinks combination found for each apk. To make it more visual and easy to use, the cell
                        background colour is red if the number is not 0.<br/><br/>

                        To close the pop up modal, click on the Clear button.

                    </div>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography className="title">5. Get some stats on the crawler!</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                    <div className="stepContainer">
                        On the Home page, you can access some statistics on the crawler by blicking on the following:
                        <img src="img/block.png" className="small"/>

                        This page includes two sections:
                        <ul>
                            <li>Categories: the number of apps per category.</li>
                            <li>Ratings: the number of apps per rating.</li>
                        </ul>
                        In each section, two interactive graphs are displayed to better illustrate these statistics: a pie chart and a histogram. An example is showed below:
                        <img src="img/statistics_page_category.png" className="big"/>
                    </div>
                    </Typography>
                </AccordionDetails>
            </Accordion>
      
        </div>
    );
}

export default Readme;