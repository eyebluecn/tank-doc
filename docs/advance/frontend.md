# Eyeblue Cloud Disk Frontend 

Eyeblue Cloud Disk adopts vue2.0 + vue-router + vue-resource + es6 +less technology stack ，import model layer which hierarchy corresponds to the database storage hierarchy，and provide models for the view layer，
Then the view layer can take action with object-oriented thought，this is the essence of the project，components folder contains some common components，welcome to use and put forward suggestions!

## Project partial structure

```
├── doc                                            // Vue-cli configuration
├── node_modules                                  
├── public                                         // Entrance
├── src                                       
│   ├── assets                                     // Assets
│   ├── common                                     // Common folder
│   │   ├── directive                              // Custom instruction
│   │   │   ├── directive.js                       // Validation
│   │   ├── filter                                 // Format
│   │   ├── fork                                   // Reference
│   │   ├── i18n                                   // International
│   │   ├── util                                   
│   ├── components                                 // Components tool folder
│   │   ├── copy                                   // Copy tool
│   │   ├── filter                                 // Filter tool
│   │   ├── photoswipe                             // Picture preview 
│   │   ├── previewer                              // General preview
│   │   ├── CreateSaveButton.vue                   // Create and Save button
│   │   ├── LoadingFrame.vue                       // Loading frame
│   │   ├── NbBtnDropdown.vue                      // Button drop down
│   │   ├── NbCheckbox.vue                         // Checkbox
│   │   ├── NbExpanding.vue                        // Contraction and expansion
│   │   ├── NbPager.vue                            // Pager
│   │   ├── NbRadio.vue                            // Radio
│   │   ├── NbSlidePanel.vue                       // Slide panel
│   │   ├── NbSwitcher.vue                         // Switcher
│   ├── model                                      // Model of frontend
│   │   ├── base                                   // Base
│   │   │   ├── Base.js                            // Base class
│   │   │   ├── BaseEntity.js                      // Entity base class
│   │   │   ├── Filter.js                          // Filter class
│   │   │   ├── Pager.js                           // Pager class
│   │   ├── dashboard                              // Control panel class
│   │   ├── download                               // Download token class
│   │   ├── image                                  // Image cache class
│   │   ├── install                                // Configurate class
│   │   ├── matter                                 // File class
│   │   ├── preference                             // Preference class
│   │   ├── share                                  // Share
│   │   │   ├── Share.js                           // Share class
│   │   │   ├── ShareExpireOption.js               // Shared time class
│   │   │   ├── ShareType.js                       // Shared type class
│   │   ├── user                                   // User
│   │   │   ├── User.js                            // User class
│   │   │   ├── UserRole.js                        // User role class
│   │   │   ├── UserStatus.js                      // User status class
│   ├── router                                     // Router
│   ├── views                                      // View
│   │   ├── dashboard                              // Panel view
│   │   │   ├── theme.json                         // Echarts configuration
│   │   ├── install                                // Configurate view
│   │   ├── layout                                 // Layout view
│   │   │   ├── BottomNavigation.vue               // Bottom layout
│   │   │   ├── SideMenu.vue                       // Sidebar menu
│   │   │   ├── SideNavigation.vue                 // Sidebar layout
│   │   │   ├── TopNavigation.vue                  // Header layout
│   │   ├── matter                                 // File view
│   │   │   ├── widget 
│   │   │   │   ├── imageCache                     // Image cache plugins                                                     
│   │   │   │   ├── Director.js                    // Director class      
│   │   │   │   ├── FolderTree.vue                 // Folder Tree      
│   │   │   │   ├── MatterImage.vue                // Image file     
│   │   │   │   ├── MatterPanel.vue                // Single file or folder individual     
│   │   │   │   ├── MoveBatchPanel.vue             // Bulk file movement components      
│   │   │   │   ├── UploadMatterPanel.vue          // File upload component 
│   │   ├── preference                             // Personalized view
│   │   ├── share                                  // Share view
│   │   ├── user                                   // User view
│   │   │   ├── feature                            // Rights enum
│   │   ├── Frame.vue                              // Frame
│   ├── vuex                                       // Store
├── vue.config.js                                  // Vue configuration
```