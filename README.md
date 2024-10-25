TO DO:

- Add a way to zoom and dezoom the timeline
- Make it easier to change time in the settings (add preset values and maybe +1 -1 hours buttons)
- Add a way to center on the current time
- Make the calendar either work on two days, or limit end day settings to 23h59
- Add a placeholder when you drag task into the calendar
- Add a sonner to click on the task and see which sessions it's linked to
- add a settings to add sound with the sonner and end of session + start of session
- add custom sound options
- Add a settings to set the start time to now visible on the main page
- Ensure that the tooltip works on click too

Design

- Decide on the color palette (both light and dark modes)
- Imagine global design of the page (think mobile first)
- Show a hand moving to display the drag and drop possibilty
- Add a nice shadcn popup when a session is over (no sound, just a popup)
- Animate when changing the duration only
- Create tooltip for day/agenda view and settings
- Try changing the color when hovering over a session with a task
- Try changing the color when the session has a task associated

To go further:

- Add a way to save your settings
- Add a way to add recurring tasks that will be setup by default
- Add a way to save your schedule

Done:

- Limit task name to 25 characters
- Make the calendar look better on long days
- Make hide breaks and pauses toggles
- Add session timer and task name in title
- Ensure taks name are synced from task to timeline but not from timeline to task (on deletion and renaming)
- Add a way to edit the task name from the task list
- Add a restriction so the task name can't be the same as another task name
- Make the sessions static (can't change the size, can't move them)
- Remove the ability to edit the task name within the timeline
- Change event component to display title as a div, and on click it turns to an input ?
- Ensure that break don't reset the task names
- Allow the break to be removed even when it's the only break
- Fix why the app crashes when the start time is set to now
- Add a trash icon on hover to remove task from the timeline
- Add a time showing in which session we are
- Add a the time remaining in the session
- Add a cursor that indivcate the current time and moves along the timeline
- Add a task list that can be edited
- Add a way to rename tasks
- Add a way to drag and drop the task in the timeline
- Add a way to remove tasks from the task list
- Add the total hours worked expected to be worked during the day

If and when we'll add interactivity:

- Add a way to click on a task in the timeline and edit it
- Add a way to click on a task in the timeline and remove it
- Allow for the possibility to click and press suppr button to remove task
- Ensure that moving breaks on the timeline move them in the settings
- Add the posbility to rename breaks
- Ensure the task on the timeline and task list are synced, from one way to task list to timeline

GIT:

- use git log --oneline to see the commit history and retrieve old functions

Prompt:

I trigger my switch in @CalendarButtons.tsx . It updates my state in @PomodoroDay.tsx that is @showPauses , this showpauses, trigger the useMemeo function @filteredEvents because the dependecy changes. This triggers a rerender of my calendar with the new filterered events pass as the events props. This triggers also a rerender of all my @EventComponent.tsx because the event changed and react big calendar rerenders the event then

Info in @WorkSessionSummary.tsx:

Number of sessions planned during the day
Total time expected working
Total time worked
Total time remaining
Start time
End time
