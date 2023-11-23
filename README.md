# SoulMachine integration with eva
## Prerequisites:
- Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) on your local machine.
- Authenticate the Google Cloud SDK:
- Ensure you have the necessary permissions on Google Cloud. You should ideally have roles that allow you to manage Cloud Run, such as `roles/run.admin`, roles/run.developer, and `roles/cloudbuild.builds.builder`. You can verify roles in the IAM section of the GCP console or via the gcloud CLI.
- Enable the Cloud Run and Cloud Build APIs for your project. You can do this through the Google Cloud Console under "API & Services" -> "Library", or you might be prompted to do so when running certain gcloud commands for the first time.
```
gcloud auth login
```

## Steps:
### 1. Clone the GitHub Repository:

Download the source code from the GitHub repository.
```
git clone https://github.com/eva-professional-services/soulmachine-eva-v2.git
cd soulmachine-eva-v2
```

### 2. Build the Docker Image using Google Cloud Build:
#### 2.1 Configuration using `config.json`:

Before building your Docker image, you should set up the environment variables and keys. The application reads settings from a `config.json` file located at the project root. This file should be structured based on the [config.template.json](./config.template.json)

#### 2.2 Build:

This command submits a build using Google Cloud Build and stores the built image in the Google Container Registry.

```
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/YOUR_IMAGE_NAME .
```

Replace:
- YOUR_PROJECT_ID with your Google Cloud Project ID (e.g., eva-sm-project)
- YOUR_IMAGE_NAME with a desired name for your container (e.g., eva-sm-container).

### 3. Deploy to Google Cloud Run:

Now that you have the image built, deploy it to Cloud Run.

```
gcloud beta run deploy YOUR_CLOUD_RUN_SERVICE_NAME --image gcr.io/YOUR_PROJECT_ID/YOUR_IMAGE_NAME --region YOUR_REGION --platform managed --allow-unauthenticated --port 8080
```
Replace:
- YOUR_CLOUD_RUN_SERVICE_NAME with a name for your Cloud Run service (e.g., eva-sm-cloudrun).
- YOUR_PROJECT_ID with your Google Cloud Project ID.
- YOUR_IMAGE_NAME with the name of your container image.
- YOUR_REGION with the desired Cloud Run region (e.g., us-east1).

> Note: If you've used the --allow-unauthenticated flag, your service will be publicly accessible. If you want to restrict access, remove this flag and set up authentication as needed.

Once the deploy is done, the console will show
```
...
Done.
Service [YOUR_CLOUD_RUN_SERVICE_NAME] revision [YOUR_CLOUD_RUN_SERVICE_NAME-NNNNN-xxx] has been deployed and is serving 100 percent of traffic.
Service URL: <SERVICE_URL>
``````

The `SERVICE_URL` value need in the following step.

### 4. SoulMachine

#### Create avatar in SoulMachine

Use the interfaces from https://studio.soulmachines.cloud/ to create your digital human.

#### Define Skill

Go to upper-rigth button "Settings" -> "Manage Skills" and create a new Skill using the following template replace the values. 

```
{
  "name": "<SOULMACHINE_PROJECT_NAME>",
  "summary": "<SOME_SUMMARY>",
  "description": "<SOME_DESCRIPTION>",
  "isPublic": false,
  "status": "ACTIVE",
  "serviceProvider": "SKILL_API",
  "categoryIds": [],
  "endpointInitialize": null,
  "endpointSession": null,
  "endpointExecute": "<SERVICE_URL>/execute",
  "endpointEndSession": null,
  "endpointEndProject": null,
  "endpointMatchIntent": null,
  "languages": null,
  "config": {
    "skillType": "BASE_CORPUS"
  }
}
```
#### Asign the Skill to the avatar

In the project configuration, section Conversation & Skills, press `MANAGE` and select the skill from the list.


