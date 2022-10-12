### Helm
<br>
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
Each of those resources is defined in a separate YAML manifest, but your application logically requires all of those components to function correctly - you need to deploy them as a unit
<br>
A Helm chart is a definition of the resources that are required to run an application in Kubernetes.
<br>

##### Parameterising manifests using Helm templates


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