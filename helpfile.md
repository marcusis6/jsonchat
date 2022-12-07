চ্যাটরুমের লেটেস্ট জিপ ফাইলের লিঙ্কঃ 
------

একটি টরিফাইড ভিএম(whonix gateway + যেকোনো vm EX: Kali) এর firefox browser এ একটি VPN extension ইন্সটাল করে নিন ইনশাআল্লাহ।
যেমনঃ Touch VPN। 
-------

ভিপিএন অন অবস্থায় একটি মেইল (EX: proton mail) খুলে ফেলুন ইনশাআল্লাহ। 
----------

এর পর নিচের ধাপ গুলো স্টেপ বাই স্টেপ ফলো করবেন ইনশাআল্লাহ। 
----

**নোটঃ** বাকি কাজগুলো ভিপিএন অন অবস্থায় করতে হবে। 
-----------

mongoDb গাইডঃ 
-----------

1.  মেইল একাউন্ট দিয়ে  https://www.mongodb.com এ একটা একাউন্ট খুলুন।
1.  মেইল এ গিয়ে email verifaction কমপ্লিট করুন।
1.  একাউন্ট খুলে গেলে aws, free forever এগুলো সিলেক্ট  করে নতুন একটি cluster তৈরি করুন।
1.  cluster এর নাম সাধারনত "cluster 0" থাকে। কিছুক্ষন সময় নিবে  cluster এক্টিভ হতে।
1.  এখন  "Security" ট্যাব থেকে "Database access" এ ক্লিক করে "ADD NEW USER" এ একটি নাম ও পাসওয়ার্ড দিয়ে "Add user" এ ক্লিক করুন। 
1.  পাসওয়ার্ড এ শুধু অক্ষর ব্যাবহার করবেন। নাম ও পাসওয়ার্ডটি সেভ রেখে দিন। 
1.  এরপর "Security" ট্যাব থেকে " Network access" এ ক্লিক করে "ADD IP ADDRESS" এ  0.0.0.0  বসিয়ে "Confirm" দিয়ে দিন।

1. এবার "CLusters" ট্যাব এ গিয়ে "collections" এ ক্লিক করে "Create  Database" এ ক্লিক করে "Database Name" এ test ও "Collection Name" এ users লিখে create এ ক্লিক করুন। Create হয়ে যাবে। 

1. এবার users এর উপর ক্লিক করে ডানপাশে "Insert Document" এ ক্লিক করুন। 

1. "Insert to Collection" লেখা ১টা পেজ আসবে। সেখানে View লেখার পাশে "{}" তে ক্লিক করুন। নিচের লেখার মত ১টা লেখা পাবেন।
```
{
    "_id": {
        "$oid": "616318329f03c50d56e03817"
    }
}
```


"616318329f03c50d56e03817" এর জায়গায় আপনার কোড ভিন্ন হবে। এবার আগের লেখাটি নিচের লেখাটি দিয়ে রিপ্লেস করে দিন। খেয়াল রাখবেন "$oid" এর পরের কোডটা আপনার নিজেরটা হবে।
```
{
    "_id": {
        "$oid": "616318329f03c50d56e03817"
    },
    "isApproved":true,
    "isAdmin":true,
    "isSuperAdmin":true,
    "approvedBy":"client",
    "username":"client",
    "name":"client",
    "password":"$2a$10$LcNS37AK3hXflesvDEnRSuYwjLmvnU81mS2d3YFfpuGWMZ4r3RsBK",
    "date":"1630598992760",
    "__v": {
        "$numberInt": "0"
    }
}
```


11. এরপর "Insert" বাটনে ক্লিক করুন। 

12. এরপর আবার "CLusters" ট্যাব এ গিয়ে "connect" এ ক্লিক করে  "choose a connection method" তারপর "Connect your Application" এ ক্লিক করে "Connection String Only" এ একটি  string  দিবে। স্ট্রিংটি একটি টেক্সট ডকুমেন্টে এ কপি করে নিয়ে string এ "<password" এর স্থানে যে পাসওয়ার্ডটি  সেভ রেখেছিলেন সেটি পেস্ট করুন।  

13. এরপর স্ট্রিং এ `mongodb.net` এর পরে কিছু থাকলে সেটা মুছে দিন এবং নিচের অংসটুকু যুক্ত করুন:

` /test?ssl=true&replicaSet=atlas-qkusun-shard-0&authSource=admin&retryWrites=true&w=majority`

 
14. সর্বশেষ স্ট্রিংটি এরকম হবেঃ 
`mongodb+srv://rimoihjih:efegFGHdVgkNBT@cluster0-iyeev.mongodb.net/test?ssl=true&replicaSet=atlas-qkusun-shard-0&authSource=admin&retryWrites=true&w=majority`

15. তারপর এই এডিটেড স্ট্রিংটি সেভ করে রাখুন।
16. এবার unzip করা folder এ প্রবেশ করে config ফোল্ডার এ যান এবং keys.js ফাইল্টি এডিট করলে MonoURI:"" এরকম দেখতে পাবেন। দুই ক্লোনের মাঝে   সেভ করা স্ট্রিং টি পেস্ট করুন।  (MonoURI:"এখানে" )
17. তারপর ফাইলটি সেভ করুন। 
18. এবার এই ফাইলগুলো github এ আপলোড করতে হবে এবং render.com এ deploy করতে হবে ইনশাআল্লাহ। 

github গাইডঃ 
-------

1.  মেইল একাউন্ট দিয়ে  https://www.github.com এ একটা একাউন্ট খুলুন।
1.  একাউন্ট খোলার সময় একটি পাজেল আসবে সেটা সল্ভ করে create account দিন। পাজেল সল্ভ না হলে সাউন্ড এর আইকোন আছে দেখুন ওটাতে ক্লিক করলে ৫-৬ টা শব্দ বলবে, শব্দ গুলো টাইপ করতে হবে।
1.  মেইল এ গিয়ে email verifaction কমপ্লিট করুন।
1.  তারপর github এ গিয়ে Start a new project দিন।
1.  Repository name যেকোন এ একটি নাম দিন। নামটা কপি করে রাখুন।
1.  তারপর private সিলেক্ট করুন।
1.  create reposatory দিন।
1.  Quick setup এর ১ লাইন নিচে দেখুন uploading an existing file আছে, ওটাতে ক্লিক করুন।
1.  এবার চ্যাটরুমের লেটেস্ট জিপ ফাইলটি আনজিপ করুন। unzip করা folder এর সব ফাইল গুলো আপলোড করতে হবে।
1.  তারপর Commit changes দিন।


render.com গাইডঃ 
----------

1.  প্রথমে আপনার Github একাউন্টটি login করে নিন। 
1.  এরপর এই লিঙ্ক (https://dashboard.render.com/register?next=/) এ গিয়ে Github বাটনে ক্লিক করে Sign Up করে নিন ইনশাআল্লাহ। 
1. নোটঃ পরবর্তিতে login করার সময়ও আইডি পাসওয়ার্ড লাগবে না। Github বাটনে ক্লিক করলে অটো লগইন হয়ে যাবে। তবে অবশ্যই আগে গিটহাব লগইন করে নিতে হবে। মূলত Github থেকে সে জেনে নেই যে আপনিই আসল ইউজার কিনা। 
1.  Sign Up শেষ হলে dashboard এ আসবে। না আসলে login করে নিন।
1.  dashboard এ উপরের ডান পাশের New বাটনে ক্লিক করুন। 
1.  এরপর Web Service সিলেক্ট করুন। 
1.  Connect to Github বাটনে ক্লিক করে Github এর সাথে একাউন্টটি যুক্ত করে নিন। 
1.  Connect a repository থেকে আপনার রিপজিটরিটি Connect করুন। 
1.  এরপর একটি পেজ আসবে। সেখানে Name ফিল্ড এ একটি ইউনিক নাম লিখুন। যেমনঃ galaxy120, nixon2x, parrothub, dropx50
1.  তারপর Create Web Service এ ক্লিক করুন। 
1.  এখন উপরের ডান পাশে এ Manual Deploy তে ক্লিক করুন।
1.  Deploy latest commit এ ক্লিক করুন। 
1.  প্রসেস শেষ হওয়া পর্যন্ত অপেক্ষা করুন। উপরের বাম পাশ থেকে চ্যাট রুমের লিঙ্ক টি কপি করে নিন ইনশাআল্লাহ।  











