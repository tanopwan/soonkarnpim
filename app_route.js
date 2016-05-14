'use strict';
 
 /* App Module */

var app = angular.module('soonkarnpimApp', [
  'ui.router',
  'customer.app',
  'customer.services',
  'quotation.app',
  'quotation.services',
  'job.app',
  'job.services'
]);

app.config(function($stateProvider, $urlRouterProvider){
    console.log("Soonkarnpim App Started!");

    // For any unmatched url, send to 
    $urlRouterProvider
        .otherwise("/route/customer");
    
    $stateProvider
        .state('customer', {
            url: "/route/customer",
            templateUrl: "/views/customer.html",
            controller: "controller.customer.list"
        })
        .state('customer.add', {
            url: "/add",
            templateUrl: "/views/customer-form.html",
            controller: "controller.customer.add"
        })
        .state('customer.edit', {
            url: "/edit/:key",
            templateUrl: "/views/customer-edit-form.html",
            controller: "controller.customer.edit"
        })
        .state('quotation', {
            url: "/route/quotation",
            templateUrl: "views/quotation.html",
            controller: "controller.quotation.list"
        })
        .state('quotation.add', {
            url: "/add",
            templateUrl: "views/quotation-form.html",
            controller: "controller.quotation.add.edit"
        })
        .state('quotation.edit', {
            url: "/edit/:key",
            templateUrl: "views/quotation-form.html",
            controller: "controller.quotation.add.edit"
        })
        .state('quotation.view', {
            url: "/view/:key",
            templateUrl: "views/quotation-print-template.html",
            controller: "controller.quotation.print"
        })
        .state('job', {
            url: "/job",
            templateUrl: "views/job.html",
            controller: "controller.job.list"
        })
        .state('job.edit', {
            url: "/edit/:key",
            templateUrl: "views/quotation-form.html",
            controller: "controller.quotation.add.edit"
        })
        .state('job.view', {
            url: "/view/:key",
            templateUrl: "views/quotation-print-template.html",
            controller: "controller.quotation.print"
        });
});
