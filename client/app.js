'use strict';

var moneyGateApp = angular.module('moneyGateApp', ['moneyGateControllers', 'moneyGateDirectives']);

window.PC = window.PC || {};

/**
 * Set PC.CtrlHelper.
 *
 * PC.CtrlHelper keeps track of the controller's current status
 */
(function (obj) {
    var ctrlHelper = function () {
        var self = this;

        // Default callback that is called regardless of $http response status.
        self.always = null;

        // Default callback that is called on $http success status.
        self.success = function (data, status, headers, config) {
            self.isLoading = false;
        };

        // Default callback that is called on $http error status.
        self.failure = function (data, status, headers, config) {
            self.isLoading = false;
            self.isValid = false;
            self.errors = [data.error_message];
        };

        self.reset = function () {
            self.isLoading = false;
            self.isValid = true;
            self.errors = [];
        };

        // Initialize.
        self.reset();

        return self;
    };
    obj.CtrlHelper = ctrlHelper;
}(window.PC));
