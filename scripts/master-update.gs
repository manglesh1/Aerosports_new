// Run batch1 from batch1.gs
// Run batch2 from batch2.gs
// Run batch3 from batch3.gs
// Run batch4 from batch4.gs
// Run batch5 from batch5.gs
// Run batch6 from batch6.gs
// Run batch7 from batch7.gs
// Run batch8 from batch8.gs

function runAllBatches() {
  updateBlogsBatch1();
  Utilities.sleep(2000);
  updateBlogsBatch2();
  Utilities.sleep(2000);
  updateBlogsBatch3();
  Utilities.sleep(2000);
  updateBlogsBatch4();
  Utilities.sleep(2000);
  updateBlogsBatch5();
  Utilities.sleep(2000);
  updateBlogsBatch6();
  Utilities.sleep(2000);
  updateBlogsBatch7();
  Utilities.sleep(2000);
  updateBlogsBatch8();
  Utilities.sleep(2000);
  Logger.log("All batches complete!");
}
