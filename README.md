# Render PlantUML preview

Install the PlantUML extension in VS Code.  Ensure Graphviz is installed and configured correctly.  Open a `.puml` file. The PlantUML preview should automatically render.  If not, try restarting VS Code or manually triggering a preview refresh.

# Explain

## Interconnections and Data Flow with Examples
***UI to API:***

Example: A bank employee inputs customer data on the web app, which sends the data via HTTP POST to the Classification API.

***API to Preprocess:***

Example: The API receives the data and calls the preprocessing module to clean and transform it.

***Preprocess to Training (During Model Development):***

Example: The preprocessed historical data is sent to the training module to build the initial model.

***Training to Evaluation:***

Example: The trained model is evaluated on test data to check its accuracy.

***Evaluation to Deployment:***

Example: If the model meets performance criteria, it's passed to the deployment module.

***Deployment to API:***

Example: The deployed model is integrated into the API for real-time predictions.

***API to UI:***

Example: The API sends the classification result back to the UI to display to the user.

***DB Interaction:***

***Raw Data to Preprocess:***
The database provides raw customer data for preprocessing during training.

***Preprocessed Data to DB:***
The module saves cleaned data back to the database for future use.

***Training to DB:***
The model parameters or the trained model are saved for versioning.