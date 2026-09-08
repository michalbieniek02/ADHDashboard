FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["backend/ADHDashboard.Api/ADHDashboard.Api.csproj", "backend/ADHDashboard.Api/"]
RUN dotnet restore "backend/ADHDashboard.Api/ADHDashboard.Api.csproj"

COPY . .
WORKDIR "/src/backend/ADHDashboard.Api"

RUN dotnet build "ADHDashboard.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ADHDashboard.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ADHDashboard.Api.dll"]