# Ember 1.9.1 Template Compiler for Visual Studio
## Overview
These projects are used for building ember templates on a build event within Visual Studio. Once set up, the Ember templates in your project will be precompiled into a JavaScript file on a right click > build event which improves loading performance of the ember application.

## How It Works
The project files for visual studio have nodes in the XML called Target with an attribute of Name, the one in question has Name equal to BeforeBuild. This is amended manually so that Visual Studio calls the .NET console application before building which in turn calls a Node server which performs JavaScript tasks, in this case, builds templates. But can be extended to do other performance enhancing builds.

## Set Up

1. Download and install Node for Windows [here](http://nodejs.org/download/)
2. Download and install Node Tools for Visual Studio [here](http://nodejstools.codeplex.com/)
3. Download and install the correct version of IISNODE for you version of IIS [here](https://github.com/tjanczuk/iisnode)
4. Create a site in IIS called Tharis.Tools.Node and point it to the root of the project Tharis.Tools.Node
5. Update the project file that contains the ember application that needs to have the templates precompiled, continue reading for more information on how to do this

### Updating Visual Studio Project Files
I have included both of these projects in this repository and I recommend that they be added to the solution of the Ember application so they are build at the same time as the Ember Solution. Once Tharis.Tools.App is built then you will notice the .exe is in the bin folder for the configuration you are currently building in, typically Debug or Release. Once you have a location of the .exe file then you can begin to update the Ember application project file.

Uncomment the Target node where the Name attribute is equal to BeforeBuild. Add a child node called Exec and add an attribute called Command so it looks like this:
```xml
<Target Name="BeforeBuild">
 <Exec Command="" />
</Target>
 ```
The command needs to be the .exe file that was mentioned above and the argument to be passed into that .exe file should be the root of the Ember application, the same one that is encapsulated by the project file you are updating. You can use a combination of the following to point to the .exe:

1. $(SolutionDir)
2. $(ProjectDir)
3. $(Configuration)
4. ..\

You may end out with something like this:
```xml
<Target Name="BeforeBuild">
 <Exec Command="$(SolutionDir)Tharis.Tools.App\bin\$(Configuration)\Tharis.Tools.App.exe $(ProjectDir)" />
</Target>
 ```
 **Remark:** Don't forget the argument, in this case `$(ProjectDir)`, or you could enter a full path manually.
 
## Notes
The Node application assumes templates are in .\Templates and the compiled templates will go into the file .\Application\AppTemplates.js, these values can be amended in the Node application in app.js.

If you would like to add any other tasks to this Node Visual Studio build event which are aiming towards improving performace of Ember applications, please contribute :).
