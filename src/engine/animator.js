/** Danh sách việc cần chạy mỗi khung hình (nước chảy, cáp treo, xe chạy, hoa rơi…). */
const tasks = [];

/** @param {(dt: number, time: number, ctx: object) => void} task */
export const onFrame = (task) => { tasks.push(task); };

export function runFrame(dt, time, ctx) {
  for (const task of tasks) task(dt, time, ctx);
}
