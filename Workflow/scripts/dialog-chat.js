ObjC.import('stdlib');
var fromAlfred = $.getenv('kiki_data');
const alfredWorkflowData = fromAlfred;
const currentDir = $.NSFileManager.defaultManager.currentDirectoryPath.js
const filePath = `${alfredWorkflowData}/lastresponse.txt`;
const iconPath = `${currentDir}/icon.png`;

// Read the file contents
let fileContents = ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError(filePath, $.NSUTF8StringEncoding, null));

if (fileContents.length > 1800) {
  fileContents = fileContents.substring(0, 1800) + "...\n\n(Response truncated. Don't worry, your conversation is intact. You may reply back or copy.)";
}

// Escape file contents for AppleScript
let escapedFileContents = fileContents.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const appleScript = `
    set userResponse to display dialog "${escapedFileContents}" buttons {"Close", "Copy & Close", "Continue"} with icon POSIX file "${iconPath}" default button 3 default answer "" cancel button "Close" with title "Continue Conversation"
    if button returned of userResponse is "Continue" then
        if text returned of userResponse is "" then
            set dialogInput to "-"
        else
            set dialogInput to text returned of userResponse
        end if
	else if button returned of userResponse is "Copy & Close" then
		set dialogInput to "-"
    else
		set dialogInput to ""
    end if
	return dialogInput
`;

const script = $.NSAppleScript.alloc.initWithSource(appleScript);
const executionResult = script.executeAndReturnError(null);
const resultString = ObjC.unwrap(executionResult.stringValue);

resultString;