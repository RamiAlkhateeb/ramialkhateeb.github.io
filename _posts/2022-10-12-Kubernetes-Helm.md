
Helm is a tool for managing Kubernetes charts. Charts are packages of pre-configured Kubernetes resources.
<br>
Helm charts as a unit of deployment
<br>
When you deploy an application to Kubernetes, you typically need to configure many different resources. If you consider a publicly-facing ASP.NET Core application, you typically need as a minimum:
<br>
- A deployment, containing a pod consisting of your Dockerised ASP.NET Core application
<br>
- A service, acting as a load balancer for the pods making up your deployment
<br>
- An ingress, to expose the service as an HTTP endpoint
<br>
<br>

Each of those resources is defined in a separate YAML manifest, but your application logically requires all of those components to function correctly - you need to deploy them as a unit
<br>
A Helm chart is a definition of the resources that are required to run an application in Kubernetes.
<br>

### Parameterising manifests using Helm templates


### Trying Helm while deploying a project
First we will do a dockerfile 

```
FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine3.12 AS build
WORKDIR /sln

# Copy project file and restore
COPY "./HelloWorld.csproj" "./HelloWorld/"
RUN dotnet restore ./HelloWorld/HelloWorld.csproj

# Copy the actual source code
COPY "./" "./HelloWorld"

# Build and publish the app
RUN dotnet publish "./HelloWorld/HelloWorld.csproj" -c Release -o ./app/publish

#FINAL image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine3.12
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "HelloWorld.dll"]
```
I build and tag the docker images for each app (for the Service app below) using

```
docker build -f Dockerfile -t rami13k/helloworld:0.1.0 .
```


## Creating the default helm charts
We'll start off by creating a Helm chart using the helm CLI. Ensure that you've installed the command line and prerequisites
https://helm.sh/docs/intro/install/

<br>

You can have helm scaffold a new chart for you by running helm create <chart name>. We'll create a new chart called test-app inside a solution-level directory cunningly named charts:

```
mkdir charts
cd charts
helm create test-app
```

The structure I like to have is a top-level chart for the solution, test-app in this example, and then sub-charts for each individual "app" that I want to deploy as part of the chart.

<br>

```
cd test-app
rm -r templates/* # Remove contents of top-level templates directory
cd charts

helm create test-app-api # Create a sub-chart for the API
helm create test-app-service # Create a sub-chart for the service

 # we don't need these files for sub-charts
rm test-app-api/.helmignore test-app-api/values.yaml
rm test-app-service/.helmignore test-app-service/values.yaml

# I'm not going to deal with these for now
rm test-app-api/templates/hpa.yaml test-app-api/templates/serviceaccount.yaml
rm test-app-service/templates/hpa.yaml test-app-service/templates/serviceaccount.yaml
rm -r test-app-api/templates/tests test-app-service/templates/tests
```

<br>
we should change some values in values file, like repository name 