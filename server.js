// Require dependencies for gRPC and Proto
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Require dependency for WriteFile
const fs = require('node:fs');

//Require dependencies for file uploads
const express = require('express');
const fileUpload = require('express-fileupload');

// Load the .proto file
const PROTO_PATH = "./support.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const supportProto = grpc.loadPackageDefinition(packageDefinition).support;

// Implement the Contact service: Client is initially presented with option to talk to a Chatbot or a real person
const contactService = {
	
	ChatToPerson: (call, callback) => {
		
		const userID = call.request.userID;
		const itemID = call.request.itemID;
		
		// Write user's details to the record file
		fs.appendFile(userID+'_report.txt', userID+'\n'+itemID+'\n\n', 'utf8', (err) => {
			if (err) {
				console.error('Error writing file:', err);
				return;
			}
			console.log('File written successfully!');
		});
		
		const queueMsg = "Waiting for an available employee.";
		callback(null, { queueMsg }); // Send the current iteration of queueMsg back to the Client
		
		for ( let i = 4; i > 1; i--) { // For loop that counts from 4 to 2
			queueMsg = "You are number "+(i)+" in the queue!";
			var millisecondstoWait = 5000; // 5 second delay
			setTimeout(function() {
				callback(null, { queueMsg }); // Send the current iteration of queueMsg back to the Client
			}, millisecondsToWait);
		}
		
		queueMsg = "You've been connected to an employee! Please ask your question. Type 'x' to exit.";
		callback(null, { queueMsg }); // Send the final iteration of queueMsg back to the Client
		
    }
	
	ChatToBot: (call, callback) => {
		
		const userID = call.request.userID;
		const itemID = call.request.itemID;
		
		// Write user's details to the record file.
		fs.appendFile(userID+'_report.txt', userID+'\n'+itemID+'\n\n', 'utf8', (err) => {
			if (err) {
				console.error('Error writing file:', err);
				return;
			}
			console.log('File written successfully!');
		});
		
		const botMsg = "You've been connected to a bot! Please ask your question. Type 'x' to exit.";
		callback(null, { botMsg }); // Send the current iteration of botMsg back to the Client
		
	}
	
}

// Implement the chatbot service
const chatbotService = {
	
	Chat : (call, callback) => {
		
		int userID = call.request.userID;
		
		const question = call.request.question; //Makes the question variable equal the Client's message.
		
		// Write user's messages to the record file.
		fs.appendFile(userID+'_report.txt', 'Client: '+question+'\n\n', 'utf8', (err) => {
			if (err) {
				console.error('Error writing file:', err);
				return;
			}
			console.log('File written successfully!');
		});
		
		// As I cannot develop a full AI to handle the issues presented, this is a default message that will be returned instead.
		const answer = "Sorry to hear that! We are working hard to bring you the best service possible, even though we may be underqualified to do so!";
		
		// Write bot's response to the record file.
		fs.appendFile(userID+'_report.txt', 'Bot: '+answer+'\n\n', 'utf8', (err) => {
			if (err) {
				console.error('Error writing file:', err);
				return;
			}
			console.log('File written successfully!');
		});
		
		callback(null, { answer }); // Send the current iteration of answer back to the Client
		
	}
	
}

// Implement the Sentiment Analysis Service
const sentimentAnalysisService = {
	
	Review (call, callback) => {
		
		const userID = call.request.userID;
		const satisfaction = call.request.satisfaction;
		const reviewResult = call.request.reviewResult;
		
		// If the client was satisfied, happy = yes, if not, happy = no
		if (satisfaction == 1){
			const happy = 'Yes';
			const reviewResponse = 'Glad we could help!';
		}
		else {
			const happy = 'No';
			const reviewResponse = 'Sorry we could not help.';
		}
		
		// Write if the customer was satisfied
		fs.appendFile(userID+'_report.txt', 'Is the customer satisfied? '+happy+'\n\n', 'utf8', (err) => {
			if (err) {
				console.error('Error writing file:', err);
				return;
			}
			console.log('File written successfully!');
		});
		
		// Write the customer's review/report
		fs.appendFile(userID+'_report.txt', 'Customer comment: '+reviewResult+'\n\n', 'utf8', (err) => {
			if (err) {
				console.error('Error writing file:', err);
				return;
			}
			console.log('File written successfully!');
		});
		
	callback(null, { reviewResponse });
		
	}
	
}

// Implement the Image Upload service
const imageUploadService = {
	
	PhotoUpload: (call, callback) => {
		
		const userID = call.request.userID;
		const folderName = (userID+'_image'); // Folder uses client's userID in the name to identify it
		const folderPath = '/images';
		
		try { // Attempt to create a folder with the user's ID to contain the image if none exists in the images folder.
			if (!fs.existsSync('/images/'+folderName)) {
				fs.mkdirSync('/images/'+folderName);
			}
		} catch (err) {
			console.error(err);
		}
		
		// Take user's submitted file
		const photo = call.request.photo;
		
		const app = express();
		
		app.use(fileUpload());
		
		// Use the images directory in the project folder
		app.use(('/images/'+folderName), express.static(path.join(__dirname,('/images/'+folderName))));
		
		// post the file inside the images directory in a newly created folder
		app.post(('/images/'+folderName), (req, res) => {
			
			if (!req.files || Object.keys(req.files).length === 0) {
				return res.status(400).send('No files were uploaded.');
			}
			
			// Specify the file and path
			let uploadedFile = req.files.photo;
			const uploadPath = path.join(__dirname, ('/images/'+folderName), uploadedFile.name);

			uploadedFile.mv(uploadPath, (err) => { // Upload the file to the specified path
				if (err) {
					return res.status(500).send(err);
				}
				
			});
		}
		
		// Return response once upload is complete
		const photoReply = 'Image uploaded successfully. Sorry we could not help, we will send you an email if there is an update regarding your issue!';
		callback(null, { photoReply });
		
	}
	
}

// Start gRPC Server
const server = new grpc.Server();
server.addService(supportProto.Support.service, supportService);
server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log("gRPC Support Server is running on port 50051...");
});