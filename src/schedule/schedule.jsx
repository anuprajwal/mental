import React, { useState } from "react";
import "./schedule.css";

const WellnessScheduler = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState({
    title: "",
    duration: "",
    priority: "medium",
    deadline: "",
  });
  const [schedule, setSchedule] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    setTaskInput({ ...taskInput, [e.target.name]: e.target.value });
  };

  // Add a new task
  const addTask = () => {
    if (!taskInput.title || !taskInput.duration) return;
    setTasks([...tasks, taskInput]);
    setTaskInput({
      title: "",
      duration: "",
      priority: "medium",
      deadline: "",
    });
  };

//   const generateSchedule = () => {
//     const priorityOrder = { high: 1, medium: 2, low: 3 };
//     const sortedTasks = [...tasks].sort(
//       (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
//     );
  
//     // Fixed blocks of wellness activities
//     // startHour: in 24h decimal format, duration in minutes
//     const fixedBlocks = [
//       { start: 13, duration: 60, label: "Lunch 🍱" },            // 1:00 – 2:00 PM
//       { start: 15.5, duration: 30, label: "Recreation 🎶 (walk / hobby)" }, // 3:30 – 4:00 PM
//       { start: 19, duration: 45, label: "Dinner 🍽️" },           // 7:00 – 7:45 PM
//       { start: 20, duration: 45, label: "Family / Friends Time ❤️" }, // 8:00 – 8:45 PM
//       { start: 21.75, duration: 15, label: "Meditation 🧘‍♂️" },  // 9:45 – 10:00 PM
//       { start: 22, duration: 540, label: "Sleep 😴" },            // 10:00 PM – 7:00 AM
//     ];
  
//     // Build timeline gaps
//     let schedule = [];
  
//     const toDate = (hour) => {
//       const d = new Date();
//       d.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
//       return d;
//     };
  
//     // Build a list of all day segments between fixed blocks
//     let currentHour = 9; // start at 9 AM
//     for (let fb of fixedBlocks) {
//       if (fb.start > currentHour) {
//         // Gap from currentHour to fb.start — put tasks here
//         schedule.push({
//           type: "gap",
//           start: currentHour,
//           end: fb.start,
//         });
//       }
//       // Then fixed block
//       schedule.push({
//         type: "fixed",
//         ...fb,
//         end: fb.start + fb.duration / 60,
//       });
//       currentHour = fb.start + fb.duration / 60;
//     }
  
//     // Fill tasks inside gaps
//     let newSchedule = [];
//     let taskIndex = 0;
  
//     schedule.forEach((block) => {
//       if (block.type === "fixed") {
//         // Add fixed event directly
//         const startDate = toDate(block.start);
//         const endDate = toDate(block.end);
//         newSchedule.push({
//           time: `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
//           task: block.label,
//           priority: "wellness",
//         });
//       } else {
//         // Gap block — fill with tasks
//         let gapStart = block.start;
//         let gapEnd = block.end;
  
//         while (taskIndex < sortedTasks.length) {
//           let task = sortedTasks[taskIndex];
//           let durationHrs = parseInt(task.duration, 10) / 60;
  
//           // if task fits fully
//           if (gapStart + durationHrs <= gapEnd) {
//             const startDate = toDate(gapStart);
//             const endDate = toDate(gapStart + durationHrs);
//             newSchedule.push({
//               time: `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
//               task: task.title,
//               priority: task.priority,
//             });
//             gapStart += durationHrs;
  
//             // break after task
//             if (gapStart + 10 / 60 <= gapEnd) {
//               const breakStart = toDate(gapStart);
//               const breakEnd = toDate(gapStart + 10 / 60);
//               newSchedule.push({
//                 time: `${breakStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${breakEnd.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
//                 task: "Break 🌱 (stretch / breathe / water)",
//                 priority: "wellness",
//               });
//               gapStart += 10 / 60;
//             }
  
//             taskIndex++;
//           } else {
//             // not enough space for this task — leave for next gap
//             break;
//           }
//         }
//       }
//     });
  
//     setSchedule(newSchedule);
//   };
  
  

// Paste this function inside your component (where tasks, setSchedule are available)

const generateSchedule = () => {
    // 1) priority sort
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedTasks = [...tasks].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  
    // 2) candidate timing arrays (you can change or compute these)
    const lunchOptions = [12, 12.5, 13, 13.5];        // 12:00, 12:30, 13:00, 13:30
    const recreationOptions = [14, 15, 15.5, 16];     // choices for recreation (14=2pm)
    const dinnerOptions = [18.5, 19, 19.5, 20];       // 18.5=6:30pm, etc.
    const familyOptions = [19.5, 20, 20.5, 21];       // family/friends time
  
    // simple slot chooser (choose middle-of-day candidate by default)
    const chooseSlot = (options) => {
      const dayStart = 9;
      const sleepStart = 22;
      const mid = (dayStart + sleepStart) / 2;
      let best = options[0];
      let bestDiff = Math.abs(options[0] - mid);
      for (let o of options) {
        const d = Math.abs(o - mid);
        if (d < bestDiff) {
          best = o;
          bestDiff = d;
        }
      }
      return best;
    };
  
    const lunchStart = chooseSlot(lunchOptions);
    const recreationStart = chooseSlot(recreationOptions);
    const dinnerStart = chooseSlot(dinnerOptions);
    const familyStart = chooseSlot(familyOptions);
  
    // 3) fixed wellness events with durations (minutes)
    const meditationStart = 21.75; // 21.75 => 21:45
    const meditationDuration = 15;
    const sleepStart = 22; // 22:00
    const sleepDurationMin = 9 * 60; // sleep until 07:00 -> 540 minutes
  
    const fixedBlocks = [
      { start: lunchStart, duration: 60, label: "Lunch 🍱" },
      { start: recreationStart, duration: 30, label: "Recreation 🎶 (walk / hobby)" },
      { start: dinnerStart, duration: 45, label: "Dinner 🍽️" },
      { start: familyStart, duration: 45, label: "Family / Friends Time ❤️" },
      { start: meditationStart, duration: meditationDuration, label: "Meditation 🧘‍♂️" },
      { start: sleepStart, duration: sleepDurationMin, label: "Sleep 😴" },
    ];
  
    // 4) helpers to convert hour decimals to Date and format ranges
    const toDate = (hourDecimal) => {
      const d = new Date();
      const hh = Math.floor(hourDecimal);
      const mm = Math.round((hourDecimal - hh) * 60);
      d.setHours(hh, mm, 0, 0);
      return d;
    };
  
    const formatRange = (startDate, endDate) =>
      `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  
    // 5) build timeline: gaps between dayStart and each fixed block
    const dayStart = 9;
    const timeline = [];
    let cur = dayStart;
  
    // sort fixedBlocks by start just in case
    fixedBlocks.sort((a, b) => a.start - b.start);
  
    for (let fb of fixedBlocks) {
      if (fb.start > cur) {
        // a gap exists from cur to fb.start
        timeline.push({ type: "gap", start: cur, end: fb.start });
      }
      // push the fixed block
      timeline.push({ type: "fixed", ...fb, end: fb.start + fb.duration / 60 });
      cur = fb.start + fb.duration / 60;
    }
  
    // 6) create a mutable queue of tasks with remaining minutes
    const taskQueue = sortedTasks.map((t) => ({
      title: t.title,
      duration: parseInt(t.duration, 10), // original (minutes)
      remaining: parseInt(t.duration, 10),
      priority: t.priority,
    }));
  
    // 7) fill a gap with tasks, allowing partial allocations
    const MIN_BREAK_MIN = 10; // insert a 10-min break where possible
  
    const fillGap = (gapStartHr, gapEndHr, queue) => {
      const entries = [];
      let curHr = gapStartHr;
  
      while (curHr < gapEndHr && queue.length > 0) {
        const task = queue[0];
        if (task.remaining <= 0) {
          queue.shift();
          continue;
        }
  
        const availableMin = Math.round((gapEndHr - curHr) * 60);
        if (availableMin <= 0) break;
  
        const allocateMin = Math.min(task.remaining, availableMin);
  
        // schedule this chunk
        const sDate = toDate(curHr);
        const eDate = new Date(sDate.getTime() + allocateMin * 60000);
        const isPartial = allocateMin < task.duration || task.remaining > allocateMin;
        entries.push({
          time: formatRange(sDate, eDate),
          task: isPartial ? `${task.title} (part)` : task.title,
          priority: task.priority,
        });
  
        // advance
        curHr = curHr + allocateMin / 60;
        task.remaining -= allocateMin;
  
        // try to insert a break if there's still room in gap and more tasks remain
        const roomAfter = (gapEndHr - curHr) * 60;
        const needBreak = roomAfter >= MIN_BREAK_MIN && queue.length > 0;
        if (needBreak) {
          const bStartDate = toDate(curHr);
          const bEndDate = new Date(bStartDate.getTime() + MIN_BREAK_MIN * 60000);
          entries.push({
            time: formatRange(bStartDate, bEndDate),
            task: "Break 🌱 (stretch / breathe / water)",
            priority: "wellness",
          });
          curHr += MIN_BREAK_MIN / 60;
        }
  
        // if task finished, remove it
        if (task.remaining <= 0) {
          queue.shift();
        } else {
          // task not finished, continue but loop may end if no time left
        }
      }
  
      return { entries, queue, curHr };
    };
  
    // 8) iterate timeline and build final schedule
    const finalSchedule = [];
    // We'll go through timeline entries: for each gap -> fill with tasks; for each fixed -> push fixed block
    let mutableQueue = taskQueue;
    for (let segment of timeline) {
      if (segment.type === "gap") {
        const { entries, queue: newQueue } = fillGap(segment.start, segment.end, mutableQueue);
        entries.forEach((e) => finalSchedule.push(e));
        mutableQueue = newQueue;
      } else if (segment.type === "fixed") {
        // push the fixed event
        const sDate = toDate(segment.start);
        const eDate = new Date(sDate.getTime() + segment.duration * 60000);
        finalSchedule.push({
          time: formatRange(sDate, eDate),
          task: segment.label,
          priority: "wellness",
        });
      }
    }
  
    // 9) if any tasks are still left after all blocks (rare if day too small), append them before sleep if possible
    if (mutableQueue.length > 0) {
      // try to append after the last fixed block (before sleep) if possible
      const lastFixed = fixedBlocks[fixedBlocks.length - 1];
      // lastFixed is Sleep; so append into the slot before Sleep start if any left
      // we will not overwrite Sleep — instead put them before meditation if possible
      // For simplicity, push remaining tasks as "Unscheduled (remaining)" chunks
      mutableQueue.forEach((t) => {
        finalSchedule.push({
          time: "Unscheduled",
          task: `${t.title} (remaining ${t.remaining}m)`,
          priority: t.priority,
        });
      });
    }
  
    // 10) set result
    console.log(finalSchedule)
    setSchedule(finalSchedule);
  };
  

  return (
    <div className="scheduler-container">
      <h1 className="scheduler-title">🗓 Wellness-Friendly Scheduler</h1>

      {/* Task Input */}
      <div className="task-input">
        <h2>Add a Task</h2>
        <div className="task-form">
          <input
            name="title"
            placeholder="Task Title"
            value={taskInput.title}
            onChange={handleChange}
          />
          <input
            name="duration"
            placeholder="Duration (minutes)"
            type="number"
            value={taskInput.duration}
            onChange={handleChange}
          />
          <select
            name="priority"
            value={taskInput.priority}
            onChange={handleChange}
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <input
            name="deadline"
            type="date"
            value={taskInput.deadline}
            onChange={handleChange}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
      </div>

      {/* Task List */}
      {tasks.length > 0 && (
        <div className="task-list">
          <h2>Your Tasks</h2>
          <ul>
            {tasks.map((t, i) => (
              <li key={i}>
                <span>
                  {t.title} ({t.duration}m) – {t.priority}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Generate Schedule Button */}
      <button className="generate-button" onClick={generateSchedule}>
        Generate Schedule
      </button>

      {/* Schedule Display */}
      {schedule.length > 0 && (
        <div className="schedule-display">
          <h2>Your Balanced Schedule</h2>
          <ul>
            {schedule.map((slot, i) => (
              <li
                key={i}
                className={slot.priority === "wellness" ? "break-slot" : "task-slot"}
              >
                <strong>{slot.time}</strong>: {slot.task}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WellnessScheduler;
