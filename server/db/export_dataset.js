const fs = require('fs');
const path = require('path');

const rawData = {
  "Arrays": [
    ["Two Sum","Easy","https://leetcode.com/problems/two-sum/","https://www.geeksforgeeks.org/problems/key-pair5616/0"],
    ["Best Time to Buy and Sell Stock","Easy","https://leetcode.com/problems/best-time-to-buy-and-sell-stock/","https://www.geeksforgeeks.org/problems/stock-buy-and-sell-1587115621/0"],
    ["Contains Duplicate","Easy","https://leetcode.com/problems/contains-duplicate/","https://www.geeksforgeeks.org/problems/check-if-array-contains-duplicates/0"],
    ["Maximum Subarray","Medium","https://leetcode.com/problems/maximum-subarray/","https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1"],
    ["Move Zeroes","Easy","https://leetcode.com/problems/move-zeroes/","https://www.geeksforgeeks.org/problems/move-all-zeroes-to-end-of-array0751/1"],
    ["Remove Duplicates from Sorted Array","Easy","https://leetcode.com/problems/remove-duplicates-from-sorted-array/","https://www.geeksforgeeks.org/problems/remove-duplicate-elements-from-sorted-array/0"],
    ["Rotate Array","Medium","https://leetcode.com/problems/rotate-array/","https://www.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1"],
    ["Merge Sorted Array","Easy","https://leetcode.com/problems/merge-sorted-array/","https://www.geeksforgeeks.org/problems/merge-two-sorted-arrays-1587115620/1"],
    ["Majority Element","Easy","https://leetcode.com/problems/majority-element/","https://www.geeksforgeeks.org/problems/majority-element-1587115620/1"],
    ["Missing Number","Easy","https://leetcode.com/problems/missing-number/","https://www.geeksforgeeks.org/problems/missing-number-in-array1416/1"],
    ["Single Number","Easy","https://leetcode.com/problems/single-number/","https://www.geeksforgeeks.org/problems/find-the-element-that-appears-once-in-every-other-element-appears-twice/1"],
    ["Product of Array Except Self","Medium","https://leetcode.com/problems/product-of-array-except-self/","https://www.geeksforgeeks.org/problems/product-array-puzzle4525/1"],
    ["Maximum Product Subarray","Medium","https://leetcode.com/problems/maximum-product-subarray/","https://www.geeksforgeeks.org/problems/maximum-product-subarray3604/1"],
    ["Find the Duplicate Number","Medium","https://leetcode.com/problems/find-the-duplicate-number/","https://www.geeksforgeeks.org/problems/find-duplicate-in-an-array/1"],
    ["Subarray Sum Equals K","Medium","https://leetcode.com/problems/subarray-sum-equals-k/","https://www.geeksforgeeks.org/problems/subarrays-with-sum-k/1"],
    ["Longest Consecutive Sequence","Medium","https://leetcode.com/problems/longest-consecutive-sequence/","https://www.geeksforgeeks.org/problems/longest-consecutive-subsequence2449/1"],
    ["Set Matrix Zeroes","Medium","https://leetcode.com/problems/set-matrix-zeroes/","https://www.geeksforgeeks.org/problems/set-matrix-zeroes/1"],
    ["Spiral Matrix","Medium","https://leetcode.com/problems/spiral-matrix/","https://www.geeksforgeeks.org/problems/spirally-traversing-a-matrix-1587115621/0"],
    ["Merge Intervals","Medium","https://leetcode.com/problems/merge-intervals/","https://www.geeksforgeeks.org/problems/overlapping-intervals/1"],
    ["3Sum","Medium","https://leetcode.com/problems/3sum/","https://www.geeksforgeeks.org/problems/three-sum-1587115621/1"],
    ["4Sum","Medium","https://leetcode.com/problems/4sum/","https://www.geeksforgeeks.org/problems/find-all-four-sum-numbers1732/1"],
    ["Trapping Rain Water","Hard","https://leetcode.com/problems/trapping-rain-water/","https://www.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1"]
  ],
  "Strings": [
    ["Valid Anagram","Easy","https://leetcode.com/problems/valid-anagram/","https://www.geeksforgeeks.org/problems/anagram-1587115620/1"],
    ["Valid Palindrome","Easy","https://leetcode.com/problems/valid-palindrome/","https://www.geeksforgeeks.org/problems/string-palindromic-ignoring-spaces4723/1"],
    ["Reverse String","Easy","https://leetcode.com/problems/reverse-string/","https://www.geeksforgeeks.org/problems/reverse-string/1"],
    ["Reverse Words in a String","Medium","https://leetcode.com/problems/reverse-words-in-a-string/","https://www.geeksforgeeks.org/problems/reverse-words-in-a-given-string5459/1"],
    ["Longest Common Prefix","Easy","https://leetcode.com/problems/longest-common-prefix/","https://www.geeksforgeeks.org/problems/longest-common-prefix-in-an-array5129/1"],
    ["First Unique Character in a String","Easy","https://leetcode.com/problems/first-unique-character-in-a-string/","https://www.geeksforgeeks.org/problems/non-repeating-character-1587115620/1"],
    ["Is Subsequence","Easy","https://leetcode.com/problems/is-subsequence/","https://www.geeksforgeeks.org/problems/is-subsequence-1587115620/1"],
    ["Longest Substring Without Repeating Characters","Medium","https://leetcode.com/problems/longest-substring-without-repeating-characters/","https://www.geeksforgeeks.org/dsa/length-of-the-longest-substring-without-repeating-characters/"],
    ["Group Anagrams","Medium","https://leetcode.com/problems/group-anagrams/","https://www.geeksforgeeks.org/problems/print-anagrams-together/1"],
    ["Longest Palindromic Substring","Medium","https://leetcode.com/problems/longest-palindromic-substring/","https://www.geeksforgeeks.org/problems/longest-palindrome-in-a-string1956/1"],
    ["Palindromic Substrings","Medium","https://leetcode.com/problems/palindromic-substrings/","https://www.geeksforgeeks.org/dsa/count-palindrome-sub-strings-string/"],
    ["String Compression","Medium","https://leetcode.com/problems/string-compression/","https://www.geeksforgeeks.org/dsa/string-compression/"],
    ["Minimum Window Substring","Hard","https://leetcode.com/problems/minimum-window-substring/","https://www.geeksforgeeks.org/problems/smallest-window-containing-all-characters-of-another-string/1"]
  ],
  "Two Pointers": [
    ["Two Sum II - Input Array Is Sorted","Medium","https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/","https://www.geeksforgeeks.org/dsa/pair-with-given-sum-in-sorted-array-two-sum-ii/"],
    ["Valid Palindrome","Easy","https://leetcode.com/problems/valid-palindrome/","https://www.geeksforgeeks.org/problems/string-palindromic-ignoring-spaces4723/1"],
    ["Remove Duplicates from Sorted Array","Easy","https://leetcode.com/problems/remove-duplicates-from-sorted-array/","https://www.geeksforgeeks.org/problems/remove-duplicate-elements-from-sorted-array/0"],
    ["Move Zeroes","Easy","https://leetcode.com/problems/move-zeroes/","https://www.geeksforgeeks.org/problems/move-all-zeroes-to-end-of-array0751/1"],
    ["Container With Most Water","Medium","https://leetcode.com/problems/container-with-most-water/","https://www.geeksforgeeks.org/problems/container-with-most-water0535/1"],
    ["3Sum","Medium","https://leetcode.com/problems/3sum/","https://www.geeksforgeeks.org/problems/three-sum-1587115621/1"],
    ["4Sum","Medium","https://leetcode.com/problems/4sum/","https://www.geeksforgeeks.org/problems/find-all-four-sum-numbers1732/1"],
    ["Trapping Rain Water","Hard","https://leetcode.com/problems/trapping-rain-water/","https://www.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1"],
    ["Sort Colors","Medium","https://leetcode.com/problems/sort-colors/","https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1"],
    ["Remove Element","Easy","https://leetcode.com/problems/remove-element/","https://www.geeksforgeeks.org/dsa/remove-element/"],
    ["Boats to Save People","Medium","https://leetcode.com/problems/boats-to-save-people/","https://www.geeksforgeeks.org/problems/minimum-boats-to-save-people/1"]
  ],
  "Sliding Window": [
    ["Maximum Average Subarray I","Easy","https://leetcode.com/problems/maximum-average-subarray-i/","https://www.geeksforgeeks.org/dsa/maximum-average-subarray-of-size-k/"],
    ["Minimum Size Subarray Sum","Medium","https://leetcode.com/problems/minimum-size-subarray-sum/","https://www.geeksforgeeks.org/problems/smallest-subarray-with-sum-greater-than-x5651/1"],
    ["Longest Substring Without Repeating Characters","Medium","https://leetcode.com/problems/longest-substring-without-repeating-characters/","https://www.geeksforgeeks.org/dsa/length-of-the-longest-substring-without-repeating-characters/"],
    ["Longest Repeating Character Replacement","Medium","https://leetcode.com/problems/longest-repeating-character-replacement/","https://www.geeksforgeeks.org/dsa/longest-substring-with-same-characters-after-replacement/"],
    ["Permutation in String","Medium","https://leetcode.com/problems/permutation-in-string/","https://www.geeksforgeeks.org/dsa/check-if-permutation-substring-of-another-string/"],
    ["Find All Anagrams in a String","Medium","https://leetcode.com/problems/find-all-anagrams-in-a-string/","https://www.geeksforgeeks.org/problems/count-occurences-of-anagrams5839/1"],
    ["Minimum Window Substring","Hard","https://leetcode.com/problems/minimum-window-substring/","https://www.geeksforgeeks.org/problems/smallest-window-containing-all-characters-of-another-string/1"],
    ["Max Consecutive Ones III","Medium","https://leetcode.com/problems/max-consecutive-ones-iii/","https://www.geeksforgeeks.org/dsa/maximize-number-of-1s-in-binary-array-by-changing-at-most-k-0s/"],
    ["Fruit Into Baskets","Medium","https://leetcode.com/problems/fruit-into-baskets/","https://www.geeksforgeeks.org/dsa/maximum-length-subarray-with-at-most-two-distinct-elements/"],
    ["Sliding Window Maximum","Hard","https://leetcode.com/problems/sliding-window-maximum/","https://www.geeksforgeeks.org/problems/maximum-of-all-subarrays-of-size-k3101/1"]
  ],
  "Hashing": [
    ["Two Sum","Easy","https://leetcode.com/problems/two-sum/","https://www.geeksforgeeks.org/problems/key-pair5616/0"],
    ["Contains Duplicate","Easy","https://leetcode.com/problems/contains-duplicate/","https://www.geeksforgeeks.org/problems/check-if-array-contains-duplicates/0"],
    ["Valid Anagram","Easy","https://leetcode.com/problems/valid-anagram/","https://www.geeksforgeeks.org/problems/anagram-1587115620/1"],
    ["Group Anagrams","Medium","https://leetcode.com/problems/group-anagrams/","https://www.geeksforgeeks.org/problems/print-anagrams-together/1"],
    ["Majority Element","Easy","https://leetcode.com/problems/majority-element/","https://www.geeksforgeeks.org/problems/majority-element-1587115620/1"],
    ["Happy Number","Easy","https://leetcode.com/problems/happy-number/","https://www.geeksforgeeks.org/dsa/happy-number/"],
    ["Longest Consecutive Sequence","Medium","https://leetcode.com/problems/longest-consecutive-sequence/","https://www.geeksforgeeks.org/problems/longest-consecutive-subsequence2449/1"],
    ["Subarray Sum Equals K","Medium","https://leetcode.com/problems/subarray-sum-equals-k/","https://www.geeksforgeeks.org/problems/subarrays-with-sum-k/1"],
    ["Top K Frequent Elements","Medium","https://leetcode.com/problems/top-k-frequent-elements/","https://www.geeksforgeeks.org/problems/top-k-frequent-elements-in-array/1"],
    ["4Sum II","Medium","https://leetcode.com/problems/4sum-ii/","https://www.geeksforgeeks.org/dsa/4sum-count/"]
  ],
  "Linked List": [
    ["Reverse Linked List","Easy","https://leetcode.com/problems/reverse-linked-list/","https://www.geeksforgeeks.org/problems/reverse-a-linked-list/1"],
    ["Merge Two Sorted Lists","Easy","https://leetcode.com/problems/merge-two-sorted-lists/","https://www.geeksforgeeks.org/problems/merge-two-sorted-linked-lists/0"],
    ["Linked List Cycle","Easy","https://leetcode.com/problems/linked-list-cycle/","https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1"],
    ["Linked List Cycle II","Medium","https://leetcode.com/problems/linked-list-cycle-ii/","https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1"],
    ["Middle of the Linked List","Easy","https://leetcode.com/problems/middle-of-the-linked-list/","https://www.geeksforgeeks.org/problems/finding-middle-element-in-a-linked-list/1"],
    ["Remove Nth Node From End of List","Medium","https://leetcode.com/problems/remove-nth-node-from-end-of-list/","https://www.geeksforgeeks.org/problems/nth-node-from-end-of-linked-list/1"],
    ["Palindrome Linked List","Easy","https://leetcode.com/problems/palindrome-linked-list/","https://www.geeksforgeeks.org/problems/check-if-linked-list-is-pallindrome/1"],
    ["Intersection of Two Linked Lists","Easy","https://leetcode.com/problems/intersection-of-two-linked-lists/","https://www.geeksforgeeks.org/problems/intersection-of-two-sorted-linked-lists/1"],
    ["Add Two Numbers","Medium","https://leetcode.com/problems/add-two-numbers/","https://www.geeksforgeeks.org/problems/add-two-numbers-represented-by-linked-lists/1"],
    ["Reorder List","Medium","https://leetcode.com/problems/reorder-list/","https://www.geeksforgeeks.org/problems/reorder-list/1"],
    ["Copy List With Random Pointer","Medium","https://leetcode.com/problems/copy-list-with-random-pointer/","https://www.geeksforgeeks.org/problems/clone-a-linked-list-with-next-and-random-pointer/1"],
    ["Merge K Sorted Lists","Hard","https://leetcode.com/problems/merge-k-sorted-lists/","https://www.geeksforgeeks.org/problems/merge-k-sorted-linked-lists/1"],
    ["Reverse Nodes in K-Group","Hard","https://leetcode.com/problems/reverse-nodes-in-k-group/","https://www.geeksforgeeks.org/problems/reverse-a-linked-list-in-groups-of-given-size/1"]
  ],
  "Stack": [
    ["Valid Parentheses","Easy","https://leetcode.com/problems/valid-parentheses/","https://www.geeksforgeeks.org/problems/parenthesis-checker2744/1"],
    ["Min Stack","Medium","https://leetcode.com/problems/min-stack/","https://www.geeksforgeeks.org/problems/get-minimum-element-from-stack/1"],
    ["Implement Stack Using Queues","Easy","https://leetcode.com/problems/implement-stack-using-queues/","https://www.geeksforgeeks.org/problems/stack-using-two-queues/1"],
    ["Evaluate Reverse Polish Notation","Medium","https://leetcode.com/problems/evaluate-reverse-polish-notation/","https://www.geeksforgeeks.org/dsa/evaluation-of-postfix-expression/"],
    ["Daily Temperatures","Medium","https://leetcode.com/problems/daily-temperatures/","https://www.geeksforgeeks.org/problems/stock-span-problem-1587115621/1"],
    ["Next Greater Element I","Easy","https://leetcode.com/problems/next-greater-element-i/","https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/0"],
    ["Next Greater Element II","Medium","https://leetcode.com/problems/next-greater-element-ii/","https://www.geeksforgeeks.org/dsa/next-greater-element-circular-array/"],
    ["Remove K Digits","Medium","https://leetcode.com/problems/remove-k-digits/","https://www.geeksforgeeks.org/dsa/remove-k-digits-to-make-smallest-number/"],
    ["Largest Rectangle in Histogram","Hard","https://leetcode.com/problems/largest-rectangle-in-histogram/","https://www.geeksforgeeks.org/problems/max-rectangle/1"],
    ["Decode String","Medium","https://leetcode.com/problems/decode-string/","https://www.geeksforgeeks.org/dsa/decode-string-recursively-encoded-count-followed-substring/"]
  ],
  "Binary Search": [
    ["Binary Search","Easy","https://leetcode.com/problems/binary-search/","https://www.geeksforgeeks.org/problems/binary-search-1587115620/0"],
    ["Search Insert Position","Easy","https://leetcode.com/problems/search-insert-position/","https://www.geeksforgeeks.org/dsa/search-insert-position-of-k-in-a-sorted-array/"],
    ["Find First and Last Position of Element in Sorted Array","Medium","https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/","https://www.geeksforgeeks.org/problems/first-and-last-occurrences-of-x3116/1"],
    ["Search in Rotated Sorted Array","Medium","https://leetcode.com/problems/search-in-rotated-sorted-array/","https://www.geeksforgeeks.org/problems/search-in-a-rotated-array4618/1"],
    ["Find Minimum in Rotated Sorted Array","Medium","https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/","https://www.geeksforgeeks.org/problems/minimum-number-in-a-sorted-rotated-array-1587115620/1"],
    ["Search a 2D Matrix","Medium","https://leetcode.com/problems/search-a-2d-matrix/","https://www.geeksforgeeks.org/problems/search-in-a-matrix-1587115621/1"],
    ["Find Peak Element","Medium","https://leetcode.com/problems/find-peak-element/","https://www.geeksforgeeks.org/problems/peak-element/1"],
    ["Sqrt(x)","Easy","https://leetcode.com/problems/sqrtx/","https://www.geeksforgeeks.org/problems/square-root/1"],
    ["Koko Eating Bananas","Medium","https://leetcode.com/problems/koko-eating-bananas/","https://www.geeksforgeeks.org/problems/koko-eating-bananas/1"],
    ["Capacity to Ship Packages Within D Days","Medium","https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/","https://www.geeksforgeeks.org/dsa/capacity-to-ship-packages-within-d-days/"],
    ["Split Array Largest Sum","Hard","https://leetcode.com/problems/split-array-largest-sum/","https://www.geeksforgeeks.org/dsa/split-array-largest-sum/"]
  ],
  "Recursion & Backtracking": [
    ["Subsets","Medium","https://leetcode.com/problems/subsets/","https://www.geeksforgeeks.org/problems/power-set4302/1"],
    ["Subsets II","Medium","https://leetcode.com/problems/subsets-ii/","https://www.geeksforgeeks.org/dsa/subsets-with-duplicates/"],
    ["Permutations","Medium","https://leetcode.com/problems/permutations/","https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1"],
    ["Permutations II","Medium","https://leetcode.com/problems/permutations-ii/","https://www.geeksforgeeks.org/dsa/permutations-of-a-string/"],
    ["Combination Sum","Medium","https://leetcode.com/problems/combination-sum/","https://www.geeksforgeeks.org/problems/combination-sum-1587115620/1"],
    ["Combination Sum II","Medium","https://leetcode.com/problems/combination-sum-ii/","https://www.geeksforgeeks.org/dsa/combination-sum-ii/"],
    ["Letter Combinations of a Phone Number","Medium","https://leetcode.com/problems/letter-combinations-of-a-phone-number/","https://www.geeksforgeeks.org/problems/possible-words-from-phone-digits-1587115620/1"],
    ["Generate Parentheses","Medium","https://leetcode.com/problems/generate-parentheses/","https://www.geeksforgeeks.org/problems/generate-all-possible-parentheses/1"],
    ["Palindrome Partitioning","Medium","https://leetcode.com/problems/palindrome-partitioning/","https://www.geeksforgeeks.org/problems/find-all-possible-palindromic-partitions-of-a-string/1"],
    ["N-Queens","Hard","https://leetcode.com/problems/n-queens/","https://www.geeksforgeeks.org/problems/n-queen-problem0315/1"],
    ["Sudoku Solver","Hard","https://leetcode.com/problems/sudoku-solver/","https://www.geeksforgeeks.org/problems/solve-the-sudoku-1587115621/1"],
    ["Word Search","Medium","https://leetcode.com/problems/word-search/","https://www.geeksforgeeks.org/problems/word-search/1"]
  ],
  "Trees": [
    ["Maximum Depth of Binary Tree","Easy","https://leetcode.com/problems/maximum-depth-of-binary-tree/","https://www.geeksforgeeks.org/problems/maximum-depth-of-binary-tree/0"],
    ["Same Tree","Easy","https://leetcode.com/problems/same-tree/","https://www.geeksforgeeks.org/dsa/check-if-two-trees-are-identical/"],
    ["Invert Binary Tree","Easy","https://leetcode.com/problems/invert-binary-tree/","https://www.geeksforgeeks.org/problems/mirror-tree/1"],
    ["Symmetric Tree","Easy","https://leetcode.com/problems/symmetric-tree/","https://www.geeksforgeeks.org/problems/symmetric-tree/1"],
    ["Binary Tree Level Order Traversal","Medium","https://leetcode.com/problems/binary-tree-level-order-traversal/","https://www.geeksforgeeks.org/problems/level-order-traversal/1"],
    ["Binary Tree Preorder Traversal","Easy","https://leetcode.com/problems/binary-tree-preorder-traversal/","https://www.geeksforgeeks.org/problems/preorder-traversal/1"],
    ["Binary Tree Inorder Traversal","Easy","https://leetcode.com/problems/binary-tree-inorder-traversal/","https://www.geeksforgeeks.org/problems/inorder-traversal/1"],
    ["Binary Tree Postorder Traversal","Easy","https://leetcode.com/problems/binary-tree-postorder-traversal/","https://www.geeksforgeeks.org/problems/postorder-traversal/1"],
    ["Diameter of Binary Tree","Easy","https://leetcode.com/problems/diameter-of-binary-tree/","https://www.geeksforgeeks.org/problems/diameter-of-binary-tree/1"],
    ["Balanced Binary Tree","Easy","https://leetcode.com/problems/balanced-binary-tree/","https://www.geeksforgeeks.org/problems/check-for-balanced-tree/1"],
    ["Lowest Common Ancestor of a Binary Tree","Medium","https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/","https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-binary-tree/1"],
    ["Path Sum","Easy","https://leetcode.com/problems/path-sum/","https://www.geeksforgeeks.org/problems/root-to-leaf-path-sum/1"],
    ["Binary Tree Right Side View","Medium","https://leetcode.com/problems/binary-tree-right-side-view/","https://www.geeksforgeeks.org/problems/right-view-of-binary-tree/1"],
    ["Binary Tree Zigzag Level Order Traversal","Medium","https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/","https://www.geeksforgeeks.org/problems/zigzag-tree-traversal/1"],
    ["Serialize and Deserialize Binary Tree","Hard","https://leetcode.com/problems/serialize-and-deserialize-binary-tree/","https://www.geeksforgeeks.org/problems/serialize-and-deserialize-a-binary-tree/1"]
  ],
  "Heap / Priority Queue": [
    ["Kth Largest Element in an Array","Medium","https://leetcode.com/problems/kth-largest-element-in-an-array/","https://www.geeksforgeeks.org/problems/kth-largest-element-in-an-array/1"],
    ["Kth Smallest Element in a Sorted Matrix","Medium","https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/","https://www.geeksforgeeks.org/problems/kth-smallest-element-in-a-row-wise-and-column-wise-sorted-matrix/1"],
    ["Top K Frequent Elements","Medium","https://leetcode.com/problems/top-k-frequent-elements/","https://www.geeksforgeeks.org/problems/top-k-frequent-elements-in-array/1"],
    ["Last Stone Weight","Easy","https://leetcode.com/problems/last-stone-weight/","https://www.geeksforgeeks.org/dsa/last-stone-weight/"],
    ["K Closest Points to Origin","Medium","https://leetcode.com/problems/k-closest-points-to-origin/","https://www.geeksforgeeks.org/problems/k-closest-points-to-origin/1"],
    ["Merge K Sorted Lists","Hard","https://leetcode.com/problems/merge-k-sorted-lists/","https://www.geeksforgeeks.org/problems/merge-k-sorted-linked-lists/1"],
    ["Find Median from Data Stream","Hard","https://leetcode.com/problems/find-median-from-data-stream/","https://www.geeksforgeeks.org/problems/find-median-in-a-stream-1587115620/1"],
    ["Task Scheduler","Medium","https://leetcode.com/problems/task-scheduler/","https://www.geeksforgeeks.org/problems/task-scheduler/1"],
    ["Meeting Rooms II","Medium","https://leetcode.com/problems/meeting-rooms-ii/","https://www.geeksforgeeks.org/dsa/minimum-number-platforms-required-railwaybus-station/"]
  ],
  "Greedy": [
    ["Assign Cookies","Easy","https://leetcode.com/problems/assign-cookies/","https://www.geeksforgeeks.org/dsa/assign-mice-to-holes/"],
    ["Jump Game","Medium","https://leetcode.com/problems/jump-game/","https://www.geeksforgeeks.org/problems/jump-game/1"],
    ["Jump Game II","Medium","https://leetcode.com/problems/jump-game-ii/","https://www.geeksforgeeks.org/problems/minimum-number-of-jumps-1587115620/1"],
    ["Gas Station","Medium","https://leetcode.com/problems/gas-station/","https://www.geeksforgeeks.org/problems/circular-tour-1587115620/1"],
    ["Candy","Hard","https://leetcode.com/problems/candy/","https://www.geeksforgeeks.org/dsa/candy-distribution/"],
    ["Partition Labels","Medium","https://leetcode.com/problems/partition-labels/","https://www.geeksforgeeks.org/dsa/partition-a-string-such-that-the-parts-have-at-least-one-character/"],
    ["Non-overlapping Intervals","Medium","https://leetcode.com/problems/non-overlapping-intervals/","https://www.geeksforgeeks.org/problems/non-overlapping-intervals/1"],
    ["Minimum Number of Arrows to Burst Balloons","Medium","https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/","https://www.geeksforgeeks.org/dsa/minimum-number-of-arrows-to-burst-balloons/"],
    ["Activity Selection","Medium","https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1","https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1"],
    ["Fractional Knapsack","Medium","https://leetcode.com/problems/fractional-knapsack/","https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1"]
  ],
  "Dynamic Programming": [
    ["Climbing Stairs","Easy","https://leetcode.com/problems/climbing-stairs/","https://www.geeksforgeeks.org/problems/count-ways-to-reach-the-nth-stair-1587115620/1"],
    ["Min Cost Climbing Stairs","Easy","https://leetcode.com/problems/min-cost-climbing-stairs/","https://www.geeksforgeeks.org/dsa/min-cost-climbing-stairs/"],
    ["House Robber","Medium","https://leetcode.com/problems/house-robber/","https://www.geeksforgeeks.org/problems/stickler-theif-1587115621/1"],
    ["House Robber II","Medium","https://leetcode.com/problems/house-robber-ii/","https://www.geeksforgeeks.org/dsa/maximum-sum-such-that-no-two-elements-are-adjacent/"],
    ["Coin Change","Medium","https://leetcode.com/problems/coin-change/","https://www.geeksforgeeks.org/problems/number-of-coins1824/1"],
    ["Coin Change II","Medium","https://leetcode.com/problems/coin-change-ii/","https://www.geeksforgeeks.org/problems/coin-change2448/1"],
    ["Perfect Squares","Medium","https://leetcode.com/problems/perfect-squares/","https://www.geeksforgeeks.org/dsa/minimum-number-of-squares-whose-sum-equals-n/"],
    ["Word Break","Medium","https://leetcode.com/problems/word-break/","https://www.geeksforgeeks.org/problems/word-break1352/1"],
    ["Longest Increasing Subsequence","Medium","https://leetcode.com/problems/longest-increasing-subsequence/","https://www.geeksforgeeks.org/problems/longest-increasing-subsequence-1587115620/1"],
    ["Partition Equal Subset Sum","Medium","https://leetcode.com/problems/partition-equal-subset-sum/","https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1"],
    ["Unique Paths","Medium","https://leetcode.com/problems/unique-paths/","https://www.geeksforgeeks.org/problems/number-of-paths-in-a-matrix-with-k-steps/1"],
    ["Minimum Path Sum","Medium","https://leetcode.com/problems/minimum-path-sum/","https://www.geeksforgeeks.org/dsa/minimum-cost-path/"],
    ["Longest Common Subsequence","Medium","https://leetcode.com/problems/longest-common-subsequence/","https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1"],
    ["Edit Distance","Hard","https://leetcode.com/problems/edit-distance/","https://www.geeksforgeeks.org/problems/edit-distance3702/1"],
    ["0/1 Knapsack","Medium","https://leetcode.com/problems/partition-equal-subset-sum/","https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1"],
    ["Target Sum","Medium","https://leetcode.com/problems/target-sum/","https://www.geeksforgeeks.org/dsa/target-sum/"]
  ],
  "Graphs": [
    ["Number of Islands","Medium","https://leetcode.com/problems/number-of-islands/","https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1"],
    ["Flood Fill","Easy","https://leetcode.com/problems/flood-fill/","https://www.geeksforgeeks.org/problems/flood-fill-algorithm1856/1"],
    ["Clone Graph","Medium","https://leetcode.com/problems/clone-graph/","https://www.geeksforgeeks.org/problems/clone-graph/1"],
    ["Course Schedule","Medium","https://leetcode.com/problems/course-schedule/","https://www.geeksforgeeks.org/problems/course-schedule/1"],
    ["Course Schedule II","Medium","https://leetcode.com/problems/course-schedule-ii/","https://www.geeksforgeeks.org/problems/course-schedule/1"],
    ["Rotting Oranges","Medium","https://leetcode.com/problems/rotting-oranges/","https://www.geeksforgeeks.org/problems/rotten-oranges2536/1"],
    ["Number of Provinces","Medium","https://leetcode.com/problems/number-of-provinces/","https://www.geeksforgeeks.org/problems/number-of-provinces/1"],
    ["Surrounded Regions","Medium","https://leetcode.com/problems/surrounded-regions/","https://www.geeksforgeeks.org/problems/replace-os-with-xs0052/1"],
    ["Word Ladder","Hard","https://leetcode.com/problems/word-ladder/","https://www.geeksforgeeks.org/problems/word-ladder/1"],
    ["Is Graph Bipartite?","Medium","https://leetcode.com/problems/is-graph-bipartite/","https://www.geeksforgeeks.org/problems/bipartite-graph/1"],
    ["Network Delay Time","Medium","https://leetcode.com/problems/network-delay-time/","https://www.geeksforgeeks.org/dsa/network-delay-time/"]
  ],
  "Union Find / DSU": [
    ["Number of Provinces","Medium","https://leetcode.com/problems/number-of-provinces/","https://www.geeksforgeeks.org/problems/number-of-provinces/1"],
    ["Number of Connected Components in an Undirected Graph","Medium","https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/","https://www.geeksforgeeks.org/dsa/connected-components-in-an-undirected-graph/"],
    ["Redundant Connection","Medium","https://leetcode.com/problems/redundant-connection/","https://www.geeksforgeeks.org/problems/union-find/1"],
    ["Accounts Merge","Medium","https://leetcode.com/problems/accounts-merge/","https://www.geeksforgeeks.org/dsa/accounts-merge/"],
    ["Most Stones Removed with Same Row or Column","Medium","https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/","https://www.geeksforgeeks.org/problems/most-stones-removed-with-same-row-or-column/1"],
    ["Satisfiability of Equality Equations","Medium","https://leetcode.com/problems/satisfiability-of-equality-equations/","https://www.geeksforgeeks.org/dsa/satisfiability-of-equality-equations/"],
    ["Kruskal's Algorithm","Medium","https://leetcode.com/problems/min-cost-to-connect-all-points/","https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1"]
  ],
  "Trie": [
    ["Implement Trie (Prefix Tree)","Medium","https://leetcode.com/problems/implement-trie-prefix-tree/","https://www.geeksforgeeks.org/problems/trie-insert-and-search0653/1"],
    ["Design Add and Search Words Data Structure","Medium","https://leetcode.com/problems/design-add-and-search-words-data-structure/","https://www.geeksforgeeks.org/problems/design-add-and-search-words-data-structure/1"],
    ["Word Search II","Hard","https://leetcode.com/problems/word-search-ii/","https://www.geeksforgeeks.org/problems/word-boggle4143/1"],
    ["Replace Words","Medium","https://leetcode.com/problems/replace-words/","https://www.geeksforgeeks.org/dsa/replace-words/"],
    ["Maximum XOR of Two Numbers in an Array","Medium","https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/","https://www.geeksforgeeks.org/problems/maximum-xor-of-two-numbers-in-an-array/1"],
    ["Longest Word in Dictionary","Medium","https://leetcode.com/problems/longest-word-in-dictionary/","https://www.geeksforgeeks.org/problems/longest-word-with-all-prefixes/1"]
  ]
};

const records = [];
for (const [topic, items] of Object.entries(rawData)) {
  items.forEach((item, idx) => {
    records.push({
      topic_problem_number: idx + 1,
      topic: topic,
      title: item[0],
      difficulty: item[1],
      leetcode_url: item[2] || null,
      gfg_url: item[3] || null,
      solved: false
    });
  });
}

// Write JSON export
const jsonPath = path.join(__dirname, 'codesolver_16_topics_full_dataset.json');
fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf-8');

// Write CSV export
const csvRows = ['topic_problem_number,topic,title,difficulty,leetcode_url,gfg_url,solved'];
records.forEach(r => {
  const escapeCsv = (str) => `"${(str || '').replace(/"/g, '""')}"`;
  csvRows.push(`${r.topic_problem_number},${escapeCsv(r.topic)},${escapeCsv(r.title)},${escapeCsv(r.difficulty)},${escapeCsv(r.leetcode_url)},${escapeCsv(r.gfg_url)},${r.solved}`);
});

const csvPath = path.join(__dirname, 'codesolver_16_topics_full_dataset.csv');
fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf-8');

console.log(`Generated JSON (${jsonPath}) and CSV (${csvPath}) with ${records.length} problem records.`);
