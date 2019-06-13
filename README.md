# EasySites

Building websites for internal (team) use should be easy and fast. EasySites makes this possible through a slick front-end built using [Angular](https://angular.io/).

EasySites was inspired by [Google Sites](https://gsuite.google.com/intl/en/products/sites/), and designed to be used for internal websites, rather than client- / customer-facing websites.

EasySites can be used, for instance, to create a knowledge base for a business that describes the systems that team members should use on a daily basis.

The site content can be saved to any modern CMS (content management system), such as Drupal or WordPress. The CMS functions as the backend for EasySites to send content to.

## Setup

### Add a CMS backend
Currently Drupal is supported, but any popular CMS should work. The CMS simply needs pages (with a body field), users, and an API for communication.

#### Drupal
Drupal 8.7 and newer is supported. Make sure to enable the following core modules: Serialization &bull; JSON:API &bull; HTTP Basic Authentication.

Also make sure you have a `services.yml` file in the `/sites` directory. Make sure that it contains at least the following:
```
parameters:
  cors.config:
    enabled: true
    allowedHeaders: ['*']
    allowedMethods: ['*']
    allowedOrigins: ['*']
    supportsCredentials: true
```

## Developing EasySites

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.

### Run using a development server

Run `ng serve` for a dev server. Navigate to [localhost:4200](http://localhost:4200/). The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Further help

#### Angular
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Contact the developers
EasySites was created by Dane Rossenrode, of [Touchdreams](http://touchdreams.co.za/). His contact details can be found on the Touchdreams website.
