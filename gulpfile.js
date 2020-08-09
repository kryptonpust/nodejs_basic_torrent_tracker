var gulp = require("gulp");
var ts = require("gulp-typescript");
var run = require("gulp-run-command").default;
var spawn = require("child_process").spawn,
  node;
var tsProject = ts.createProject("tsconfig.json");
const server = function (callback) {
  if (node) node.kill();
  node = spawn("node", ["./dist/index.js"], { stdio: "inherit" });
  node.on("close", function (code) {
    if (code === 8) {
      gulp.log("Error detected, waiting for changes...");
    }
  });
  callback();
};

const build = function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
};
const watch = function () {
  return gulp.watch("src/**/*", gulp.series("build", "server"));
};
gulp.task("server", server);
gulp.task("build", build);
gulp.task("watch", watch);
gulp.task("jest", run("npx jest"));

gulp.task(
  "dev",
  gulp.series("build", "jest", gulp.parallel("watch", "server"))
);


process.on("exit", function () {
  if (node) node.kill();
});
