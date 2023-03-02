import { Component } from '@angular/core';
// import { Filesystem, Directory } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
// import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { finalize } from 'rxjs/operators';
// import { File } from '@ionic-native/file';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
// import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
// import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import {
	AngularFireStorage,
	AngularFireUploadTask,
  } from '@angular/fire/compat/storage';
  import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { from } from 'rxjs';


interface LocalFile {
	name: string;
	path: string;
	data: string;
}
  

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss']
})

export class HomePage {

	imageUrl: string= "";
	title: string= "";
	notes: string= "";
	image: string = "";

	constructor(
		// private plt: Platform,
		// private http: HttpClient,
		// private loadingCtrl: LoadingController,
		// private toastCtrl: ToastController,
		private afStorage: AngularFireStorage,
		private afFirestore: AngularFirestore
		// private afStorage: AngularFireStorage
		//  private storage: Storage
	) {}
  
  

  

// 	async ngOnInit() {
// 		this.loadFiles();
// 	}

// 	async loadFiles() {
// 		this.images = [];

// 		const loading = await this.loadingCtrl.create({
// 			message: 'Loading data...'
// 		});
// 		await loading.present();

// 		Filesystem.readdir({
// 			path: IMAGE_DIR,
// 			directory: Directory.Data
// 		})
// 			.then(
// 				(result) => {
					
// 								},
// 				async (err) => {
// 					// Folder does not yet exists!
// 					await Filesystem.mkdir({
// 						path: IMAGE_DIR,
// 						directory: Directory.Data
// 					});
// 				}
// 			)
// 			.then((_) => {
// 				loading.dismiss();
// 			});
// 	}

// 	// Get the actual base64 data of an image
// 	// base on the name of the file
// 	async loadFileData(fileNames: string[]) {

// 		for (let f of fileNames) {
// 			const filePath = `${IMAGE_DIR}/${f}`;

// 			const readFile = await Filesystem.readFile({
// 				path: filePath,
// 				directory: Directory.Data
// 			});

// 			this.images.push({
// 				name: f,
// 				path: filePath,
// 				data: `data:image/jpeg;base64,${readFile.data}`
// 			});
// 		}
// 	}

// 	// Little helper
// 	async presentToast(text: string) {
// 		const toast = await this.toastCtrl.create({
// 			message: text,
// 			duration: 3000
// 		});
// 		toast.present();
// 	}

	async selectImage() {
	const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos // Camera, Photos or Prompt!
  });

  if (image) {
      this.saveImage(image)
  }
}
async saveImage(image: any) {
	// Generate a random ID for the image file
	const id = Math.random().toString(36).substring(2);
  
	// Convert the image URI to a Blob object
	const response = await fetch(image.webPath);
	const blob = await response.blob();
  
	// Upload the image to Firebase storage
	const ref = this.afStorage.ref(`images/${id}`);
	const task = ref.put(blob);
  
	// Get the download URL of the image after it has been uploaded
	task.snapshotChanges().pipe(
	  finalize(() => {
		ref.getDownloadURL().subscribe(downloadUrl => {
		  // Save the download URL to a variable in the correct data URL format
		  this.imageUrl = `data:${blob.type};base64,${downloadUrl}`;
		  this.image = this.imageUrl.split(',')[1];
		});
	  })
	).subscribe();
  }
  
  async uploadData() {
	if (!this.title) {
	  // Show an error message if the title is empty
	  alert('Please enter a title');
	  return;
	}
  
	// Generate a random ID for the data
	const id = Math.random().toString(36).substring(2);
  
	// Create a reference to the Firebase Firestore collection
	const collectionRef = this.afFirestore.collection('notes');
  
	// Upload the data to Firebase Firestore
	const data = {
	  title: this.title,
	  notes: this.notes,
	  imageUrl: this.imageUrl
	};
	collectionRef.doc(id).set(data).then(() => {
		this.image = "";
		this.title = "";
		this.notes = "";
	  console.log('Data uploaded successfully');
	}).catch((error: any) => {
	  console.error('Error uploading data: ', error);
	});
  }

// async saveImage(image: any) {
// 	// Generate a random ID for the image file
// 	const id = Math.random().toString(36).substring(2);
  
// 	// Create a reference to the Firebase storage path where the image will be saved
// 	const ref = this.afStorage.ref(`images/${id}`);
  
// 	// Convert the image URI to a Blob object
// 	const response = await fetch(image.webPath);
// 	const blob = await response.blob();
  
// 	// Upload the image to Firebase storage
// 	const task = this.afStorage.upload(`images/${id}`, blob);
// 	// console.log(task);
	
  
// 	// Get the download URL of the image after it has been uploaded
// 	task.snapshotChanges().pipe(
// 	  finalize(() => {
// 		ref.getDownloadURL().subscribe(downloadUrl => {
// 		  // Save the download URL to a Firestore database or do something else with it
// 		  this.imageUrl = downloadUrl;
// 		});
// 	  })
// 	).subscribe();
//   }
//   async uploadData() {
// 	if (!this.title) {
// 	  // Show an error message if the title is empty
// 	  alert('Please enter a title');
// 	  return;
// 	}
	
// 	// Generate a random ID for the note
// 	const id = Math.random().toString(36).substring(2);
	
// 	// Create a reference to the Firebase storage path where the image will be saved
// 	const imageRef = this.afStorage.ref(`images/${id}`);
	
// 	// Upload the image to Firebase storage
// 	const task = imageRef.putString(this.imageUrl, 'data_url');
	
// 	// Get the download URL of the image after it has been uploaded
// 	task.snapshotChanges().pipe(
// 	  finalize(() => {
// 		imageRef.getDownloadURL().subscribe(downloadUrl => {
// 		  // Save the download URL to a Firestore database along with the title and notes
// 		  const data = {
// 			title: this.title,
// 			notes: this.notes,
// 			imageUrl: downloadUrl
// 		  };
// 		  this.afFirestore.collection('notes').add(data).then(() => {
// 			console.log('Data uploaded successfully');
// 		  }).catch((error: any) => {
// 			console.error('Error uploading data: ', error);
// 		  });
// 		});
// 	  })
// 	).subscribe();
//   }
  
  
  
}
  

// // Create a new file from a capture image
// async saveImage(photo: Photo) {
//   const base64Data = await this.readAsBase64(photo);

//   const fileName = new Date().getTime() + '.jpeg';
//   const savedFile = await Filesystem.writeFile({
//       path: `${IMAGE_DIR}/${fileName}`,
//       data: base64Data,
//       directory: Directory.Data
//   });

//   // Reload the file list
//   // Improve by only loading for the new image and unshifting array!
//   this.loadFiles();
// }

// // https://ionicframework.com/docs/angular/your-first-app/3-saving-photos

// private async readAsBase64(photo: Photo) {
//   if (this.plt.is('hybrid')) {
//       const file = await Filesystem.readFile({
// 		path: photo.path!,
//       });

//       return file.data;
//   }
//   else {
//       // Fetch the photo, read as a blob, then convert to base64 format
//       const response = await fetch(photo.webPath!);
//       const blob = await response.blob();

//       return await this.convertBlobToBase64(blob) as string;
//   }
// }

// // Helper function
// convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
//   const reader = new FileReader;
//   reader.onerror = reject;
//   reader.onload = () => {
//       resolve(reader.result);
//   };
//   reader.readAsDataURL(blob);
// });
// 	async startUpload(file: LocalFile) {
// 		const response = await fetch(file.data);
//     const blob = await response.blob();
//     const formData = new FormData();
//     formData.append('file', blob, file.name);
//     this.uploadData(formData);
// 	}

//   // Upload the formData to our API
// async uploadData(formData: FormData) {
//   const loading = await this.loadingCtrl.create({
//       message: 'Uploading image...',
//   });
//   await loading.present();

//   // Use your own API!
//   const url = 'http://localhost:8888/images/upload.php';

//   this.http.post(url, formData)
//       .pipe(
//           finalize(() => {
//               loading.dismiss();
//           })
//       )
//       .subscribe(res => {
//            if(res){
//               this.presentToast('File upload complete.')
//           } else {
//               this.presentToast('File upload failed.')
//           }
//       });
// }

// 	async deleteImage(file: LocalFile) {
// 		await Filesystem.deleteFile({
//       directory: Directory.Data,
//       path: file.path
//   });
//   this.loadFiles();
//   this.presentToast('File removed.');
// 	}
// }

// working code
// import { Component } from '@angular/core';
// import { Observable } from 'rxjs';
// import { finalize, tap } from 'rxjs/operators';
// import {
//   AngularFireStorage,
//   AngularFireUploadTask,
// } from '@angular/fire/compat/storage';
// import {
//   AngularFirestore,
//   AngularFirestoreCollection,
// } from '@angular/fire/compat/firestore';
// export interface imgFile {
//   name: string;
//   filepath: string;
//   size: number;
// }
// @Component({
//   selector: 'app-home',
//   templateUrl: 'home.page.html',
//   styleUrls: ['home.page.scss'],
// })
// export class HomePage {
//   // File upload task
//   fileUploadTask!: AngularFireUploadTask;
//   // Upload progress
// //   percentageVal!: Observable<number>;
//   // Track file uploading with snapshot
//   trackSnapshot!: Observable<any>;
//   // Uploaded File URL
//   UploadedImageURL!: Observable<string>;
//   // Uploaded image collection
//   files: Observable<imgFile[]>;
//   // Image specifications
//   imgName!: string;
//   imgSize!: number;
//   // File uploading status
//   isFileUploading: boolean;
//   isFileUploaded: boolean;
//   private filesCollection: AngularFirestoreCollection<imgFile>;
//   constructor(
//     private afs: AngularFirestore,
//     private afStorage: AngularFireStorage
//   ) {
//     this.isFileUploading = false;
//     this.isFileUploaded = false;
//     // Define uploaded files collection
//     this.filesCollection = afs.collection<imgFile>('imagesCollection');
//     this.files = this.filesCollection.valueChanges();
//   }
//   uploadImage(event: Event) {
// 	const inputElement = event.target as HTMLInputElement;
// 	if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
// 	  console.log('No file selected!');
// 	  return;
// 	}
// 	const file = inputElement.files[0];
// 	console.log(file)
//     // Image validation
//     if ( file.type.split('/')[0] !== 'image') {
//       console.log('File type is not supported!');
//       return;
//     }
//     this.isFileUploading = true;
//     this.isFileUploaded = false;
//     this.imgName = file ? file.name : '';
//     // Storage path
//     const fileStoragePath = `filesStorage/${new Date().getTime()}_${file.name}`;
//     // Image reference
//     const imageRef = this.afStorage.ref(fileStoragePath);
//     // File upload task
//     this.fileUploadTask = this.afStorage.upload(fileStoragePath, file);
//     // Show uploading progress
//     // this.percentageVal = this.fileUploadTask?.percentageChanges();
//     this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(
//       finalize(() => {
//         // Retrieve uploaded image storage path
//         this.UploadedImageURL = imageRef.getDownloadURL();
//         this.UploadedImageURL.subscribe(
//           (resp) => {
//             this.storeFilesFirebase({
//               name: file.name,
//               filepath: resp,
//               size: this.imgSize,
//             });
//             this.isFileUploading = false;
//             this.isFileUploaded = true;
//           },
//           (error) => {
//             console.log(error);
//           }
//         );
//       }),
//       tap((snap) => {
//         this.imgSize = snap ? snap.totalBytes : 0;
//       })
//     );
//   }

//   storeFilesFirebase(image: imgFile) {
//     const fileId = this.afs.createId();
//     this.filesCollection
//       .doc(fileId)
//       .set(image)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }