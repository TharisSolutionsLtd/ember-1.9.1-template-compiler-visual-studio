

var outputTemplates, templateDirectory, responseStatusCode, responseMessage;

var templateExtension = ".html";

var compiler = require('ember-template-compiler');
var fs = require('fs');
var http = require('http');
var url = require('url');

var readAndRemoveBom = function (filePath) {
    var data = fs.readFileSync(filePath).toString();
    return data.slice(1);
}

var compileTemplate = function (filePath) {
    var data = readAndRemoveBom(filePath);
    if (data) {
        var startIndex = templateDirectory.length + 1;
        var endIndex = templateDirectory.length + filePath.length - templateDirectory.length;
        var name = filePath.substring(startIndex, endIndex);
        name = name.substring(0, name.length - templateExtension.length);
        var nameParts = name.split('/');
        for (var i = 0; i < nameParts.length; i++) {
            nameParts[i] = nameParts[i].charAt(0).toLowerCase() + nameParts[i].slice(1);
        }
        name = nameParts.join('/');
        var preCompiledTemplate = compiler.precompile(data, false);
        return "Ember.TEMPLATES[\"" + name + "\"] = Ember.Handlebars.template(" + preCompiledTemplate + ");";
    }
};

var readDir = function (dir) {
    var children = fs.readdirSync(dir);
    var templates = "";
    for (var i = 0; i < children.length; i++) {
        if (children[i].indexOf(templateExtension) == -1) {
            if (children[i].indexOf('.') == -1) {
                templates += readDir(dir + '/' + children[i]);
            }
        } else {
            templates += compileTemplate(dir + '/' + children[i]) + "\n\n";
        }
    }
    return templates;
}

var compileTemplates = function (url) {
    var templates = readDir(templateDirectory);
    fs.writeFile(outputTemplates, templates, function (error) {
        if (error) {
            throw error;
        }
    });
};

var init = function (request) {
    var urlParts = url.parse(request.url, true);
    var query = urlParts.query;
    
    outputTemplates = query.dir.toString() + "Application\\AppTemplates.js";
    templateDirectory = query.dir.toString() + "Templates";
}

var server = http.createServer(function (request, response) {
    response.setHeader("Content-Type", "text/html");
    try {
        init(request);
        compileTemplates(request);
        
        response.statusCode = 200;
        response.write("Templates - " + templateDirectory + "\n");
        response.write("Compiled Templates - " + outputTemplates + "\n");
        response.end("Tasks completed successfully");
    }
    catch (error) {
        response.statusCode = 500;
        response.end(error);
    }
}).listen(process.env.port);