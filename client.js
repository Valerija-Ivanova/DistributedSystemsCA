// Require dependencies
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Load the .proto file
const PROTO_PATH = "./support.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const supportProto = grpc.loadPackageDefinition(packageDefinition).support;

// Create gRPC Client
const client = new supportProto.Support("localhost:50051", grpc.credentials.createInsecure());

/*SEQUENCE TO FOLLOW:

service Contact -> ChatRequest (int option, int userID, int itemID)
<- QueueResponse (String queueMsg)
<- ChatResponse (String botMsg)
"State your problem!"

service Chatbot -> ChatQuestion (int userID, String question - if X, close service)
<- ChatAnswer (String answer - same)
"Was your problem solved? Y/N" - loop until valid reponse

service SentimentAnalysis -> ReviewRequest (int userID, int satisfaction, String reviewResult)
<- ReviewResponse (String reviewResponse)
String contains "Glad to help" / "Sorry"
"Want to send an image of the issue? Y/N" - loop until valid response
End / "Please choose the file to upload"

service ImageUpload -> PhotoUpload (file image (.png/jpeg/jpg) - loop until valid response)
<- PhotoResponse (String photoReply)
String contains "Uploaded! Gonna get in touch via email."
End */

// Function to call Contact service, v contents as written in proto file
const performContact = (option, userID, itemID) => {
    
	// Error handling
	const request = { userID , itemID };
    
    client[option](request, (error, response) => {
        if (error) {
            console.error("Error:", error.details);
        } else {
            console.log(`Result of ${operation}: ${response.result}`);
        }
    });
};

// Function to call Chatting service, v contents as written in proto file
const performChatbot = (userID, question) => {
	// Removed error handling due to lack of compatibility with request sending format.
};

// Function to call Sentiment Analysis service, v contents as written in proto file
const performSentimentAnalysis = (userID, satisfaction, reviewResult) => {
	// Removed error handling due to lack of compatibility with request sending format.
};

// Function to call Image Upload service, v contents as written in proto file
const performImageUpload = (photo) => {
	// Removed error handling due to lack of compatibility with request sending format
};

// Get user input
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

//First message shown to the user
console.log("\n <> <> Welcome to the Customer Support App! <> <>");

int option = 0;
int userID = 123456; // Example, each user would have a unique ID
	
do { // While loop to take user's choice on who to talk to
	readline.question("\nPlease type 1 to speak to a human employee or 2 to speak to a bot. ", (option) => {
		
		// Check if the input was correct, inform user if it wasn't
		if ( option != 1 && option != 2 ) {
			console.log("Invalid choice, please try again.");
		} else {
			readline.close();
		}
		
	});
} while ( option != 1 && option != 2 ) // Repeat until correct format

do { // While loop to take the user's data on which device they're looking for help with
	readline.question("\nPlease type the number of your product: \n1: Phone \n2: TV \n3: Tablet \n4: Headset \n5: Microphone \n6: Speakers \n7: Desktop \n8: Laptop \n9: Smartwatch \n10: Camera ", (itemID) => {
		
		// Check if the input was correct, inform user if it wasn't
		if ( itemID >= 1 && itemID <= 10 ) {
			console.log("Invalid choice, please try again.");
		} else {
			readline.close();
		}
		
	});
} while ( itemID >= 1 && itemID <= 10 ) // Repeat until correct format

performContact(option, userID, itemID); //Call the contact service

//Check whether the response was a queueMsg or botMsg and print the right response
if (typeof queueMsg === 'undefined' || queueMsg === null) {
    //If there isn't a queueMsg, do nothing.
 } else {
	 console.log(queueMsg);
 }
 
 if (typeof botMsg === 'undefined' || botMsg === null) {
    //If there isn't a botMsg, do nothing.
 } else {
	 console.log(botMsg);
 }

//Here the user is sent the server's String that they've been connected to a person or bot and may state their issue.
readline.question("\nHow can I help you today? ", (question) => {
	
	do { // While loop to take the user's messages and print the server's responses until the user ends the stream.
		
		if (question == "X" || question == "x") { // If the user types X or x the stream is ended 
			console.log("Has your problem been fixed?");
		} else { // Otherwise continue the chat
			performChatbot(userID, question);
			console.log(answer);
		}
		
	} while (question != "X" || question != "x")
	
	readline.close();
		
});

// Take input to determine if the user was satisfied
readline.question("\nPlease type y/n ", (satisfaction) => {
	
	do { // While the input isn't valid, repeat
	
		if (satisfaction == 'Y' || satisfaction == 'y') {
			satisfaction = 1; // Customer is satisfied
		} else if (satisfaction == 'N' || satisfaction == 'n') {
			satisfaction = 2; // Customer isn't satisfied
		} else {
			console.log("Invalid choice, please try again.");
		}
		
	} while (satisfaction != 1 && satisfaction != 2)
	
	readline.question("\nPlease write what your issue was so we can look into it more thoroughly for you. ", (reviewResult) => {
		
		// Submit the user's ID, comment and whether the user was satisfied
		performSentimentAnalysis(userID, satisfaction, reviewResult);
		console.log(reviewResponse); //User receives message, either happy to help or an apology
		
		readline.close();
		
	});

});

if (satisfaction == 2) { // If the customer is dissatisfied
	
	readline.question("\nWould you like to upload an image or screenshot of your issue to be logged for review? y/n", (choice) => {
		
		do {
	
			if (choice == 'Y' || choice == 'y') { // If willing to upload, proceed to upload file
				
				//Image Upload would be done here through a GUI, with a button to browse for files.
				//File = UploadedImage.png/jpeg/jpg/webp/gif
				performImageUpload(photo);
				console.log(photoReply); // Apology and a promise to send an email when the issue is investigated.
				
			} else if (choice == 'N' || choice == 'n') { // If unwilling to upload, end
				console.log("Very well, thank you for visiting.");
			} else {
				console.log("Invalid choice, please try again.");
			}
		
		} while (choice != 'Y' && choice != 'y' && choice != 'N' && choice != 'n') // While the input isn't valid, repeat
			
		readline.close();
		
	});
	
}

