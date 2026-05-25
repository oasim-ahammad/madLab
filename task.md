Build a complete mobile application named "Task Manager" using React Native + Expo.

Goal:
Create a productivity app for visual task management similar to Trello/ClickUp style.

Important Requirements:

- No Login System
- No Registration System
- No Backend
- No Firebase
- No Supabase
- No External Database

Current device user will automatically be considered as the owner/user.

Store everything locally inside the mobile app.

Tech Stack:

- React Native
- Expo
- JavaScript
- React Navigation
- AsyncStorage (Local Storage)
- Expo Notifications
- React Native Gesture Handler
- React Native Reanimated
- Draggable FlatList
- Expo Device

Install packages:

npx expo install expo-notifications

npm install @react-native-async-storage/async-storage

npm install react-native-draggable-flatlist

npm install react-native-gesture-handler

npm install react-native-reanimated

npm install @react-navigation/native

npm install @react-navigation/native-stack

npx expo install react-native-screens react-native-safe-area-context

UI Design Requirements:

Create modern mobile UI.

Design:
- Professional UI
- Smooth animation
- Mobile responsive
- Clean UX
- Dark and light friendly design
- Beautiful task cards

Application Screens:

1. Home Dashboard Screen

Features:
- Create Board
- Delete Board
- Search Board
- Show Boards

2. Board Screen

Lists:

- Todo
- Doing
- Review
- Completed

Features:

- Add List
- Delete List
- Drag and Drop Cards
- Move cards between columns

3. Task Details Screen

Task Card Fields:

- Task Name
- Owner (Current Device User)
- Start Date (Auto Generate)
- Required Time
- Deadline
- Priority
    - High
    - Medium
    - Low
- Members
- Description
- Status
    - Pending
    - In Progress
    - Completed
- Remaining Time
- Comments
- Activity History

4. Notification Screen

Features:

- Upcoming Deadlines
- Reminder Notifications
- Deadline Alerts

5. Profile Screen

Show:

- Current User
- Assigned Tasks
- Completed Task Count

Task Features:

Create Task

Edit Task

Delete Task

Assign Members

Set Deadline

Set Priority

Set Required Time

Views:

1. Board View

Kanban Style Board

Columns:

Todo

Doing

Review

Completed

2. List View

Sort Tasks By:

- Deadline
- Priority
- Status

Filters:

- Completed
- Assigned Members
- Priority

Drag and Drop:

Drag cards between columns.

Update task status automatically.

Activity Log:

Store locally using AsyncStorage.

Format:

"[owner] added [task_name] at [time]"

"[owner] updated [task_name] at [time]"

"[owner] deleted [task_name] at [time]"

"[owner] moved [task_name] to [column] at [time]"

"[owner] completed [task_name] at [time]"

Notifications:

Use Expo Notifications.

Trigger:

- 1 day before deadline
- 1 hour before deadline
- Deadline reached

Task Card Color Logic:

If Completed:

Green

If Not Completed:

Color changes gradually.

Formula:

InitialTime = Total Duration

PassedTime = Current Progress Time

Rg = 255 - ((255 / InitialTime) * PassedTime)

Rr = (255 / InitialTime) * PassedTime

RGB:

rgb(Rr,Rg,0)

Behavior:

Far Deadline → Green

Medium Deadline → Yellow

Near Deadline → Red

Completed → Full Green

Priority Border:

High → Red

Medium → Orange

Low → Blue

Task Card UI Show:

- Task Name
- Deadline
- Remaining Time
- Priority Badge
- Members Avatar
- Progress Indicator
- Status Badge

Data Structure (Local AsyncStorage):

Boards

Lists

Tasks

Comments

ActivityLogs

Folder Structure:

components/

screens/

navigation/

hooks/

context/

utils/

notifications/

storage/

assets/

Requirements:

- Reusable Components
- Error Handling
- Loading State
- Empty State
- Smooth Animation
- Production Ready UI
- Full Folder Structure
- Full Source Code
- Step By Step File Generation
- Expo Compatible Packages Only

Generate complete project step by step with folder structure and all code files.