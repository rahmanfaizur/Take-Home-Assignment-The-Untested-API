# Bug Report

## Bug 1: Pagination skips the first page
- **Expected behavior**: If I ask for `page=1` with `limit=10`, I should get the first 10 items (items 0 to 9).
- **Actual behavior**: The code calculates offset as `page * limit`. If page is 1, the offset starts at 10, which totally skips the first ten items and gives you items 10-19 instead.
- **Discovery**: I noticed it while reading `getPaginated` in `taskService.js` and wrote a test to confirm it was broken.
- **Fix**: I updated the offset math to `const offset = (page - 1) * limit;`. *(Note: I went ahead and fixed this bug!)*

## Bug 2: Can't use pagination and status filters together
- **Expected behavior**: Someone should be able to get a paginated list of filtered tasks (like `?status=todo&page=1`). 
- **Actual behavior**: In `src/routes/tasks.js`, the code uses an `if (status)` check that just immediately returns the filtered array, completely ignoring any page or limit queries the user passed in.
- **Discovery**: Found it while reading the `GET /tasks` route logic.
- **Fix**: The function needs to be rewritten so that it applies the status filter first, and then runs the pagination slice on that filtered array before returning the JSON.

## Bug 3: Filtering matches substrings instead of exact strings
- **Expected behavior**: Filtering by `?status=do` shouldn't return tasks that are marked as `todo` or `done`.
- **Actual behavior**: `getByStatus` uses `t.status.includes(status)`. Because the string "todo" includes the letters "do", it returns them by mistake. 
- **Discovery**: Found via examining the filter array method in `taskService.getByStatus`.
- **Fix**: Change `.includes(status)` to a standard strict equality check (`=== status`).

## Bug 4: Completing a task overwrites its original priority
- **Expected behavior**: Marking a task as complete should just change its status to 'done' and log the time it was completed. It shouldn't mess with the priority level.
- **Actual behavior**: The `completeTask` function hardcodes `priority: 'medium'` into the updated object. This overrides the task's original priority, so a 'high' priority task suddenly becomes 'medium'.
- **Discovery**: Found while reviewing the object spread logic inside `taskService.completeTask`.
- **Fix**: Remove the `priority: 'medium'` line entirely from the `completeTask` function. *(Note: I went ahead and fixed this bug too!)*
