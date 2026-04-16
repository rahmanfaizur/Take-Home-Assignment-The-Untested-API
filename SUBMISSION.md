# Submission Note

- **What I'd test next if I had more time:**
  I would add more edge case tests around input validation. For example, testing really long strings for task titles or checking if sending unexpected data types breaks anything. I'd also like to test how the API handles simultaneous requests, like two people trying to assign the same task at the exact same moment.

- **Anything that surprised me in the codebase:**
  The pagination bug in `getPaginated` was pretty cool, the offset logic `page * limit` completely skips the first page of results! Off-by-one errors are super common, but skipping a whole page silently caught me off guard. Also, the `completeTask` function forcing the task priority to always change to `medium` regardless of what it was before was a subtle but tricky mutation bug.

- **Questions I'd ask before shipping this to production:**
  1. Are we planning to switch to a real database soon? The in-memory array will wipe out everyone's tasks the second the server restarts or if we scale up to multiple servers.
  2. Do we need authentication? Right now anyone can create, assign, or delete any task.
  3. How should we handle "un-assigning" a task? Right now we just throw an error if you try to re-assign an already assigned task.
