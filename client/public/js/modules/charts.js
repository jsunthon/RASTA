'use strict';

var charts = angular.module('charts', ['ng-fusioncharts']);

charts.controller('chartCtrl', function ($scope) {

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  var movieJsonSrc = {
    "Movies": [
      "{\"movieId\":113345,\"title\":\"Jupiter Ascending \",\"hashTitle\":\"#JupiterAscending\",\"rating\":2.6543715846994536,\"year\":2015,\"sentiment\":-2.5673758865248226}",
      "{\"movieId\":115713,\"title\":\"Ex Machina \",\"hashTitle\":\"#ExMachina\",\"rating\":3.8894774011299433,\"year\":2015,\"sentiment\":0.07829977628635347}",
      "{\"movieId\":117466,\"title\":\"In the Heart of the Sea \",\"hashTitle\":\"#IntheHeartoftheSea\",\"rating\":3.359154929577465,\"year\":2015,\"sentiment\":0.9238095238095239}",
      "{\"movieId\":117529,\"title\":\"Jurassic World \",\"hashTitle\":\"#JurassicWorld\",\"rating\":3.3765470297029703,\"year\":2015,\"sentiment\":0.8294378400161193}",
      "{\"movieId\":118706,\"title\":\"Black Sea \",\"hashTitle\":\"#BlackSea\",\"rating\":3.0843373493975905,\"year\":2015,\"sentiment\":-1.3803418803418803}",
      "{\"movieId\":120466,\"title\":\"Chappie \",\"hashTitle\":\"#Chappie\",\"rating\":3.4442567567567566,\"year\":2015,\"sentiment\":0.43283582089552236}",
      "{\"movieId\":120635,\"title\":\"Taken 3 \",\"hashTitle\":\"#Taken3\",\"rating\":2.946022727272727,\"year\":2015,\"sentiment\":-0.5142857142857142}",
      "{\"movieId\":120637,\"title\":\"Blackhat \",\"hashTitle\":\"#Blackhat\",\"rating\":2.7565789473684212,\"year\":2015,\"sentiment\":-2.0422535211267605}",
      "{\"movieId\":120799,\"title\":\"Terminator Genisys \",\"hashTitle\":\"#TerminatorGenisys\",\"rating\":3.1535859269282813,\"year\":2015,\"sentiment\":0.0379746835443038}",
      "{\"movieId\":122884,\"title\":\"Insidious Chapter 3 \",\"hashTitle\":\"#InsidiousChapter3\",\"rating\":3.066666666666667,\"year\":2015,\"sentiment\":-2.0}",
      "{\"movieId\":122894,\"title\":\"Avatar 2 \",\"hashTitle\":\"#Avatar2\",\"rating\":2.0,\"year\":2016,\"sentiment\":-0.2}",
      "{\"movieId\":122902,\"title\":\"Fantastic Four \",\"hashTitle\":\"#FantasticFour\",\"rating\":2.2699724517906334,\"year\":2015,\"sentiment\":-0.5169538632573653}",
      "{\"movieId\":125543,\"title\":\"Against The Sun \",\"hashTitle\":\"#AgainstTheSun\",\"rating\":2.8461538461538463,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":125914,\"title\":\"Mortdecai \",\"hashTitle\":\"#Mortdecai\",\"rating\":2.8227848101265822,\"year\":2015,\"sentiment\":0.3}",
      "{\"movieId\":125916,\"title\":\"Fifty Shades of Grey \",\"hashTitle\":\"#FiftyShadesofGrey\",\"rating\":1.886938202247191,\"year\":2015,\"sentiment\":-0.3588039867109635}",
      "{\"movieId\":126420,\"title\":\"American Heist \",\"hashTitle\":\"#AmericanHeist\",\"rating\":2.5588235294117645,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":126482,\"title\":\"Strange Magic \",\"hashTitle\":\"#StrangeMagic\",\"rating\":3.0434782608695654,\"year\":2015,\"sentiment\":-0.17391304347826086}",
      "{\"movieId\":127096,\"title\":\"Project Almanac \",\"hashTitle\":\"#ProjectAlmanac\",\"rating\":3.2444444444444445,\"year\":2015,\"sentiment\":-0.5384615384615384}",
      "{\"movieId\":127108,\"title\":\"Brooklyn \",\"hashTitle\":\"#Brooklyn\",\"rating\":3.6699029126213594,\"year\":2015,\"sentiment\":-0.5083211341397642}",
      "{\"movieId\":127110,\"title\":\"Digging for Fire \",\"hashTitle\":\"#DiggingforFire\",\"rating\":2.75,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":127112,\"title\":\"Don Verdean \",\"hashTitle\":\"#DonVerdean\",\"rating\":3.0,\"year\":2015,\"sentiment\":1.0}",
      "{\"movieId\":127114,\"title\":\"The End of the Tour \",\"hashTitle\":\"#TheEndoftheTour\",\"rating\":3.5597014925373136,\"year\":2015,\"sentiment\":-0.5}",
      "{\"movieId\":127116,\"title\":\"Experimenter \",\"hashTitle\":\"#Experimenter\",\"rating\":3.5526315789473686,\"year\":2015,\"sentiment\":-0.75}",
      "{\"movieId\":127118,\"title\":\"I Am Michael \",\"hashTitle\":\"#IAmMichael\",\"rating\":2.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":127122,\"title\":\"Last Days in the Desert \",\"hashTitle\":\"#LastDaysintheDesert\",\"rating\":0.0,\"year\":2015,\"sentiment\":-0.47058823529411764}",
      "{\"movieId\":127126,\"title\":\"Seoul Searching \",\"hashTitle\":\"#SeoulSearching\",\"rating\":2.3333333333333335,\"year\":2015,\"sentiment\":-0.14285714285714285}",
      "{\"movieId\":127128,\"title\":\"Mississippi Grind \",\"hashTitle\":\"#MississippiGrind\",\"rating\":3.2241379310344827,\"year\":2015,\"sentiment\":-0.12903225806451613}",
      "{\"movieId\":127130,\"title\":\"Mistress America \",\"hashTitle\":\"#MistressAmerica\",\"rating\":3.4029850746268657,\"year\":2015,\"sentiment\":-1.394736842105263}",
      "{\"movieId\":127132,\"title\":\"Zipper \",\"hashTitle\":\"#Zipper\",\"rating\":2.888888888888889,\"year\":2015,\"sentiment\":-0.1791044776119403}",
      "{\"movieId\":127134,\"title\":\"A Walk in the Woods \",\"hashTitle\":\"#AWalkintheWoods\",\"rating\":3.375,\"year\":2015,\"sentiment\":-0.5}",
      "{\"movieId\":127136,\"title\":\"True Story \",\"hashTitle\":\"#TrueStory\",\"rating\":3.122093023255814,\"year\":2015,\"sentiment\":-1.5227678571428571}",
      "{\"movieId\":127138,\"title\":\"Ten Thousand Saints \",\"hashTitle\":\"#TenThousandSaints\",\"rating\":2.6818181818181817,\"year\":2015,\"sentiment\":0.8}",
      "{\"movieId\":127140,\"title\":\"Sleeping with Other People \",\"hashTitle\":\"#SleepingwithOtherPeople\",\"rating\":3.16,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":127142,\"title\":\"Beaver Trilogy Part IV \",\"hashTitle\":\"#BeaverTrilogyPartIV\",\"rating\":0.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":127148,\"title\":\"The Hunting Ground \",\"hashTitle\":\"#TheHuntingGround\",\"rating\":3.5,\"year\":2015,\"sentiment\":-1.076470588235294}",
      "{\"movieId\":127150,\"title\":\"Fresh Dressed \",\"hashTitle\":\"#FreshDressed\",\"rating\":4.0,\"year\":2015,\"sentiment\":0.27586206896551724}",
      "{\"movieId\":127154,\"title\":\"The Mask You Live In \",\"hashTitle\":\"#TheMaskYouLiveIn\",\"rating\":4.5,\"year\":2015,\"sentiment\":-0.6428571428571429}",
      "{\"movieId\":127158,\"title\":\"Tig \",\"hashTitle\":\"#Tig\",\"rating\":3.6,\"year\":2015,\"sentiment\":-0.37575757575757573}",
      "{\"movieId\":127160,\"title\":\"In Football We Trust \",\"hashTitle\":\"#InFootballWeTrust\",\"rating\":0.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":127162,\"title\":\"Most Likely to Succeed \",\"hashTitle\":\"#MostLikelytoSucceed\",\"rating\":0.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":127188,\"title\":\"Advantageous \",\"hashTitle\":\"#Advantageous\",\"rating\":3.5172413793103448,\"year\":2015,\"sentiment\":-0.5483870967741935}",
      "{\"movieId\":127192,\"title\":\"The Bronze \",\"hashTitle\":\"#TheBronze\",\"rating\":2.125,\"year\":2015,\"sentiment\":-0.043478260869565216}",
      "{\"movieId\":127194,\"title\":\"The D Train \",\"hashTitle\":\"#TheDTrain\",\"rating\":2.9444444444444446,\"year\":2015,\"sentiment\":-0.75}",
      "{\"movieId\":127196,\"title\":\"The Diary of a Teenage Girl \",\"hashTitle\":\"#TheDiaryofaTeenageGirl\",\"rating\":3.260869565217391,\"year\":2015,\"sentiment\":-1.2857142857142858}",
      "{\"movieId\":127198,\"title\":\"Dope \",\"hashTitle\":\"#Dope\",\"rating\":3.641826923076923,\"year\":2015,\"sentiment\":-0.5926086956521739}",
      "{\"movieId\":127200,\"title\":\"I Smile Back \",\"hashTitle\":\"#ISmileBack\",\"rating\":2.8823529411764706,\"year\":2015,\"sentiment\":-0.4117647058823529}",
      "{\"movieId\":127202,\"title\":\"Me and Earl and the Dying Girl \",\"hashTitle\":\"#MeandEarlandtheDyingGirl\",\"rating\":3.8304157549234135,\"year\":2015,\"sentiment\":-0.09090909090909091}",
      "{\"movieId\":127204,\"title\":\"The Overnight \",\"hashTitle\":\"#TheOvernight\",\"rating\":3.102272727272727,\"year\":2015,\"sentiment\":0.17391304347826086}",
      "{\"movieId\":127208,\"title\":\"Results \",\"hashTitle\":\"#Results\",\"rating\":2.9875,\"year\":2015,\"sentiment\":-0.1920168067226891}",
      "{\"movieId\":127210,\"title\":\"Songs My Brothers Taught Me \",\"hashTitle\":\"#SongsMyBrothersTaughtMe\",\"rating\":4.0,\"year\":2015,\"sentiment\":-2.0}",
      "{\"movieId\":127212,\"title\":\"The Stanford Prison Experiment \",\"hashTitle\":\"#TheStanfordPrisonExperiment\",\"rating\":3.2222222222222223,\"year\":2015,\"sentiment\":-1.2}",
      "{\"movieId\":127216,\"title\":\"Unexpected \",\"hashTitle\":\"#Unexpected\",\"rating\":2.4375,\"year\":2015,\"sentiment\":-0.46489859594383776}",
      "{\"movieId\":127218,\"title\":\"Z for Zachariah \",\"hashTitle\":\"#ZforZachariah\",\"rating\":2.7403846153846154,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":127311,\"title\":\"The Forbidden Room \",\"hashTitle\":\"#TheForbiddenRoom\",\"rating\":3.3333333333333335,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":127323,\"title\":\"Vice \",\"hashTitle\":\"#Vice\",\"rating\":2.7567567567567566,\"year\":2015,\"sentiment\":-1.1479452054794521}",
      "{\"movieId\":127451,\"title\":\"A Grain of Truth \",\"hashTitle\":\"#AGrainofTruth\",\"rating\":3.75,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":127583,\"title\":\"Chuck Norris vs Communism \",\"hashTitle\":\"#ChuckNorrisvsCommunism\",\"rating\":3.1,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":127610,\"title\":\"Average Italian \",\"hashTitle\":\"#AverageItalian\",\"rating\":3.8333333333333335,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":128360,\"title\":\"The Hateful Eight \",\"hashTitle\":\"#TheHatefulEight\",\"rating\":3.9002100840336134,\"year\":2015,\"sentiment\":-0.3785425101214575}",
      "{\"movieId\":128488,\"title\":\"Wild Card \",\"hashTitle\":\"#WildCard\",\"rating\":3.0609756097560976,\"year\":2015,\"sentiment\":-0.36363636363636365}",
      "{\"movieId\":128512,\"title\":\"Paper Towns \",\"hashTitle\":\"#PaperTowns\",\"rating\":3.3200934579439254,\"year\":2015,\"sentiment\":-0.3}",
      "{\"movieId\":128520,\"title\":\"The Wedding Ringer \",\"hashTitle\":\"#TheWeddingRinger\",\"rating\":3.308,\"year\":2015,\"sentiment\":-1.8181818181818181}",
      "{\"movieId\":128542,\"title\":\"Wyrmwood \",\"hashTitle\":\"#Wyrmwood\",\"rating\":2.803030303030303,\"year\":2015,\"sentiment\":1.4}",
      "{\"movieId\":128592,\"title\":\"The Boy Next Door \",\"hashTitle\":\"#TheBoyNextDoor\",\"rating\":2.3793103448275863,\"year\":2015,\"sentiment\":-0.029411764705882353}",
      "{\"movieId\":128594,\"title\":\"Boy Meets Girl \",\"hashTitle\":\"#BoyMeetsGirl\",\"rating\":3.5,\"year\":2015,\"sentiment\":0.7246376811594203}",
      "{\"movieId\":128604,\"title\":\"Knight of Cups \",\"hashTitle\":\"#KnightofCups\",\"rating\":2.625,\"year\":2015,\"sentiment\":-0.2894736842105263}",
      "{\"movieId\":128606,\"title\":\"45 Years \",\"hashTitle\":\"#45Years\",\"rating\":3.473684210526316,\"year\":2015,\"sentiment\":1.0}",
      "{\"movieId\":128608,\"title\":\"Diary of a Chambermaid \",\"hashTitle\":\"#DiaryofaChambermaid\",\"rating\":2.1666666666666665,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":128610,\"title\":\"Ixcanul Volcano \",\"hashTitle\":\"#IxcanulVolcano\",\"rating\":4.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":128614,\"title\":\"Nobody Wants the Night \",\"hashTitle\":\"#NobodyWantstheNight\",\"rating\":1.75,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":128616,\"title\":\"As We Were Dreaming \",\"hashTitle\":\"#AsWeWereDreaming\",\"rating\":3.6666666666666665,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":128620,\"title\":\"Victoria \",\"hashTitle\":\"#Victoria\",\"rating\":3.9237288135593222,\"year\":2015,\"sentiment\":-0.3513115959794067}",
      "{\"movieId\":128624,\"title\":\"Petting Zoo \",\"hashTitle\":\"#PettingZoo\",\"rating\":1.6875,\"year\":2015,\"sentiment\":0.5614035087719298}",
      "{\"movieId\":128632,\"title\":\"Home Sweet Hell \",\"hashTitle\":\"#HomeSweetHell\",\"rating\":2.24,\"year\":2015,\"sentiment\":0.05555555555555555}",
      "{\"movieId\":128690,\"title\":\"Adult Camp \",\"hashTitle\":\"#AdultCamp\",\"rating\":3.1666666666666665,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":128727,\"title\":\"Bizarre \",\"hashTitle\":\"#Bizarre\",\"rating\":2.1666666666666665,\"year\":2015,\"sentiment\":-0.492436974789916}",
      "{\"movieId\":128838,\"title\":\"Crimson Peak \",\"hashTitle\":\"#CrimsonPeak\",\"rating\":3.3527918781725887,\"year\":2015,\"sentiment\":-0.31349911190053287}",
      "{\"movieId\":128975,\"title\":\"Hot Tub Time Machine 2 \",\"hashTitle\":\"#HotTubTimeMachine2\",\"rating\":2.4375,\"year\":2015,\"sentiment\":0.16666666666666666}",
      "{\"movieId\":129030,\"title\":\"The Coven \",\"hashTitle\":\"#TheCoven\",\"rating\":2.1052631578947367,\"year\":2015,\"sentiment\":-0.25}",
      "{\"movieId\":129354,\"title\":\"Focus \",\"hashTitle\":\"#Focus\",\"rating\":3.4903846153846154,\"year\":2015,\"sentiment\":-0.06418146650254968}",
      "{\"movieId\":129364,\"title\":\"Every Thing Will Be Fine \",\"hashTitle\":\"#EveryThingWillBeFine\",\"rating\":3.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":129372,\"title\":\"Demonic \",\"hashTitle\":\"#Demonic\",\"rating\":2.95,\"year\":2015,\"sentiment\":-0.8095238095238095}",
      "{\"movieId\":129428,\"title\":\"The Second Best Exotic Marigold Hotel \",\"hashTitle\":\"#TheSecondBestExoticMarigoldHotel\",\"rating\":3.456896551724138,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":129657,\"title\":\"Tracers \",\"hashTitle\":\"#Tracers\",\"rating\":2.5283018867924527,\"year\":2015,\"sentiment\":-0.20833333333333334}",
      "{\"movieId\":129675,\"title\":\"The Last Wolf \",\"hashTitle\":\"#TheLastWolf\",\"rating\":3.2777777777777777,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":129707,\"title\":\"The Lazarus Effect \",\"hashTitle\":\"#TheLazarusEffect\",\"rating\":2.5136986301369864,\"year\":2015,\"sentiment\":-0.25}",
      "{\"movieId\":129737,\"title\":\"Unfinished Business \",\"hashTitle\":\"#UnfinishedBusiness\",\"rating\":2.9711538461538463,\"year\":2015,\"sentiment\":-0.7761806981519507}",
      "{\"movieId\":129820,\"title\":\"Spare Parts \",\"hashTitle\":\"#SpareParts\",\"rating\":3.767857142857143,\"year\":2015,\"sentiment\":-0.5}",
      "{\"movieId\":129822,\"title\":\"Bikes vs Cars \",\"hashTitle\":\"#BikesvsCars\",\"rating\":2.9375,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":129853,\"title\":\"To Write Love on Her Arms \",\"hashTitle\":\"#ToWriteLoveonHerArms\",\"rating\":3.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":129937,\"title\":\"Run All Night \",\"hashTitle\":\"#RunAllNight\",\"rating\":3.196113074204947,\"year\":2015,\"sentiment\":-0.375}",
      "{\"movieId\":129949,\"title\":\"Assassin \",\"hashTitle\":\"#Assassin\",\"rating\":1.5,\"year\":2015,\"sentiment\":-3.3859060402684564}",
      "{\"movieId\":130056,\"title\":\"Kingdom of Shadows \",\"hashTitle\":\"#KingdomofShadows\",\"rating\":3.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":130069,\"title\":\"Road Hard \",\"hashTitle\":\"#RoadHard\",\"rating\":2.9444444444444446,\"year\":2015,\"sentiment\":1.4}",
      "{\"movieId\":130073,\"title\":\"Cinderella \",\"hashTitle\":\"#Cinderella\",\"rating\":3.291044776119403,\"year\":2015,\"sentiment\":0.3266467065868264}",
      "{\"movieId\":130075,\"title\":\"Frozen Fever \",\"hashTitle\":\"#FrozenFever\",\"rating\":2.977777777777778,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":130087,\"title\":\"The Cobbler \",\"hashTitle\":\"#TheCobbler\",\"rating\":2.792134831460674,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":130089,\"title\":\"Crazy Beautiful You \",\"hashTitle\":\"#CrazyBeautifulYou\",\"rating\":2.0,\"year\":2015,\"sentiment\":0.3333333333333333}",
      "{\"movieId\":130326,\"title\":\"Other Girls \",\"hashTitle\":\"#OtherGirls\",\"rating\":3.625,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":130448,\"title\":\"Poltergeist \",\"hashTitle\":\"#Poltergeist\",\"rating\":2.54040404040404,\"year\":2015,\"sentiment\":-0.07575757575757576}",
      "{\"movieId\":130450,\"title\":\"Pan \",\"hashTitle\":\"#Pan\",\"rating\":2.8472222222222223,\"year\":2015,\"sentiment\":-0.29261198371146013}",
      "{\"movieId\":130462,\"title\":\"The Boy \",\"hashTitle\":\"#TheBoy\",\"rating\":2.607142857142857,\"year\":2015,\"sentiment\":-0.5138055222088835}",
      "{\"movieId\":130466,\"title\":\"I Hate Christian Laettner \",\"hashTitle\":\"#IHateChristianLaettner\",\"rating\":3.725,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":130468,\"title\":\"The Circle \",\"hashTitle\":\"#TheCircle\",\"rating\":3.6666666666666665,\"year\":2015,\"sentiment\":-0.1590909090909091}",
      "{\"movieId\":130490,\"title\":\"Insurgent \",\"hashTitle\":\"#Insurgent\",\"rating\":3.173076923076923,\"year\":2015,\"sentiment\":-1.062111801242236}",
      "{\"movieId\":130492,\"title\":\"Dum Laga Ke Haisha \",\"hashTitle\":\"#DumLagaKeHaisha\",\"rating\":3.375,\"year\":2015,\"sentiment\":-0.9411764705882353}",
      "{\"movieId\":130520,\"title\":\"Home \",\"hashTitle\":\"#Home\",\"rating\":3.282828282828283,\"year\":2015,\"sentiment\":-0.12529210857451015}",
      "{\"movieId\":130576,\"title\":\"Midnight Special \",\"hashTitle\":\"#MidnightSpecial\",\"rating\":4.0,\"year\":2015,\"sentiment\":-0.13043478260869565}",
      "{\"movieId\":130618,\"title\":\"Baby \",\"hashTitle\":\"#Baby\",\"rating\":3.526315789473684,\"year\":2015,\"sentiment\":-0.0042730330264101005}",
      "{\"movieId\":130634,\"title\":\"Furious 7 \",\"hashTitle\":\"#Furious7\",\"rating\":3.3910034602076125,\"year\":2015,\"sentiment\":0.054409005628517824}",
      "{\"movieId\":130682,\"title\":\"Muck \",\"hashTitle\":\"#Muck\",\"rating\":1.6,\"year\":2015,\"sentiment\":0.05084745762711865}",
      "{\"movieId\":130684,\"title\":\"We Are Still Here \",\"hashTitle\":\"#WeAreStillHere\",\"rating\":2.671875,\"year\":2015,\"sentiment\":-0.2803030303030303}",
      "{\"movieId\":130686,\"title\":\"The Final Girls \",\"hashTitle\":\"#TheFinalGirls\",\"rating\":3.2653061224489797,\"year\":2015,\"sentiment\":-0.02857142857142857}",
      "{\"movieId\":130840,\"title\":\"Spring \",\"hashTitle\":\"#Spring\",\"rating\":3.517857142857143,\"year\":2015,\"sentiment\":0.05364110298698318}",
      "{\"movieId\":130956,\"title\":\"Child 44 \",\"hashTitle\":\"#Child44\",\"rating\":3.144578313253012,\"year\":2015,\"sentiment\":0.42857142857142855}",
      "{\"movieId\":131013,\"title\":\"Get Hard \",\"hashTitle\":\"#GetHard\",\"rating\":2.990415335463259,\"year\":2015,\"sentiment\":-0.6}",
      "{\"movieId\":131019,\"title\":\"The Intruders \",\"hashTitle\":\"#TheIntruders\",\"rating\":3.0,\"year\":2015,\"sentiment\":0.4791666666666667}",
      "{\"movieId\":131029,\"title\":\"Mara und der Feuerbringer \",\"hashTitle\":\"#MaraundderFeuerbringer\",\"rating\":1.3,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":131170,\"title\":\"Parallels \",\"hashTitle\":\"#Parallels\",\"rating\":3.1847826086956523,\"year\":2015,\"sentiment\":-0.4225352112676056}",
      "{\"movieId\":131448,\"title\":\"Walter \",\"hashTitle\":\"#Walter\",\"rating\":2.9,\"year\":2015,\"sentiment\":-0.18407960199004975}",
      "{\"movieId\":131451,\"title\":\"The Atticus Institute \",\"hashTitle\":\"#TheAtticusInstitute\",\"rating\":3.236842105263158,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":131570,\"title\":\"The Humbling \",\"hashTitle\":\"#TheHumbling\",\"rating\":2.5625,\"year\":2015,\"sentiment\":0.6666666666666666}",
      "{\"movieId\":131656,\"title\":\"Shaun the Sheep Movie \",\"hashTitle\":\"#ShauntheSheepMovie\",\"rating\":3.481382978723404,\"year\":2015,\"sentiment\":1.0}",
      "{\"movieId\":131714,\"title\":\"Last Knights \",\"hashTitle\":\"#LastKnights\",\"rating\":3.2151162790697674,\"year\":2015,\"sentiment\":-0.6}",
      "{\"movieId\":131726,\"title\":\"Matt Shepard Is a Friend of Mine \",\"hashTitle\":\"#MattShepardIsaFriendofMine\",\"rating\":4.25,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":131796,\"title\":\"Woman in Gold \",\"hashTitle\":\"#WomaninGold\",\"rating\":3.621019108280255,\"year\":2015,\"sentiment\":0.6666666666666666}",
      "{\"movieId\":131820,\"title\":\"Echoes \",\"hashTitle\":\"#Echoes\",\"rating\":2.35,\"year\":2015,\"sentiment\":0.17419354838709677}",
      "{\"movieId\":131850,\"title\":\"Killing Jesus \",\"hashTitle\":\"#KillingJesus\",\"rating\":2.6666666666666665,\"year\":2015,\"sentiment\":-2.0}",
      "{\"movieId\":132046,\"title\":\"Tomorrowland \",\"hashTitle\":\"#Tomorrowland\",\"rating\":3.19812925170068,\"year\":2015,\"sentiment\":0.05431878895814782}",
      "{\"movieId\":132128,\"title\":\"Faults \",\"hashTitle\":\"#Faults\",\"rating\":3.532258064516129,\"year\":2015,\"sentiment\":-0.16666666666666666}",
      "{\"movieId\":132136,\"title\":\"The Barber \",\"hashTitle\":\"#TheBarber\",\"rating\":3.1153846153846154,\"year\":2015,\"sentiment\":-0.6}",
      "{\"movieId\":132153,\"title\":\"Buzzard \",\"hashTitle\":\"#Buzzard\",\"rating\":3.0,\"year\":2015,\"sentiment\":-1.434782608695652}",
      "{\"movieId\":132159,\"title\":\"The Reconstruction of William Zero \",\"hashTitle\":\"#TheReconstructionofWilliamZero\",\"rating\":3.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":132173,\"title\":\"Adult Beginners \",\"hashTitle\":\"#AdultBeginners\",\"rating\":3.3076923076923075,\"year\":2015,\"sentiment\":1.0}",
      "{\"movieId\":132424,\"title\":\"The Longest Ride \",\"hashTitle\":\"#TheLongestRide\",\"rating\":3.792682926829268,\"year\":2015,\"sentiment\":0.14444444444444443}",
      "{\"movieId\":132448,\"title\":\"Einstein \",\"hashTitle\":\"#Einstein\",\"rating\":4.5,\"year\":2015,\"sentiment\":-0.20818610129564194}",
      "{\"movieId\":132458,\"title\":\"Monkey Kingdom \",\"hashTitle\":\"#MonkeyKingdom\",\"rating\":3.2857142857142856,\"year\":2015,\"sentiment\":-0.1111111111111111}",
      "{\"movieId\":132480,\"title\":\"The Age of Adaline \",\"hashTitle\":\"#TheAgeofAdaline\",\"rating\":3.51980198019802,\"year\":2015,\"sentiment\":1.1111111111111112}",
      "{\"movieId\":132496,\"title\":\"Danny Collins \",\"hashTitle\":\"#DannyCollins\",\"rating\":3.4338235294117645,\"year\":2015,\"sentiment\":1.2}",
      "{\"movieId\":132520,\"title\":\"Bad Hurt \",\"hashTitle\":\"#BadHurt\",\"rating\":2.5833333333333335,\"year\":2015,\"sentiment\":0.18181818181818182}",
      "{\"movieId\":132547,\"title\":\"A Girl Like Her \",\"hashTitle\":\"#AGirlLikeHer\",\"rating\":4.0,\"year\":2015,\"sentiment\":-1.0526315789473684}",
      "{\"movieId\":132549,\"title\":\"Grandma \",\"hashTitle\":\"#Grandma\",\"rating\":3.391304347826087,\"year\":2015,\"sentiment\":0.7346938775510204}",
      "{\"movieId\":132569,\"title\":\"Comedy Central Roast of Justin Bieber \",\"hashTitle\":\"#ComedyCentralRoastofJustinBieber\",\"rating\":3.265625,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":132594,\"title\":\"A Royal Night Out \",\"hashTitle\":\"#ARoyalNightOut\",\"rating\":2.45,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":132616,\"title\":\"The Walking Deceased \",\"hashTitle\":\"#TheWalkingDeceased\",\"rating\":2.6818181818181817,\"year\":2015,\"sentiment\":2.0}",
      "{\"movieId\":132644,\"title\":\"An Act of War \",\"hashTitle\":\"#AnActofWar\",\"rating\":2.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":132658,\"title\":\"When I Live My Life Over Again \",\"hashTitle\":\"#WhenILiveMyLifeOverAgain\",\"rating\":3.75,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":132660,\"title\":\"Man Up \",\"hashTitle\":\"#ManUp\",\"rating\":3.41025641025641,\"year\":2015,\"sentiment\":-0.6114754098360655}",
      "{\"movieId\":132735,\"title\":\"The Culling \",\"hashTitle\":\"#TheCulling\",\"rating\":1.5833333333333333,\"year\":2015,\"sentiment\":-0.478515625}",
      "{\"movieId\":132794,\"title\":\"Sweet Home \",\"hashTitle\":\"#SweetHome\",\"rating\":3.75,\"year\":2015,\"sentiment\":-0.13114754098360656}",
      "{\"movieId\":132796,\"title\":\"San Andreas \",\"hashTitle\":\"#SanAndreas\",\"rating\":2.8683574879227054,\"year\":2015,\"sentiment\":-0.4785992217898833}",
      "{\"movieId\":132798,\"title\":\"Regression \",\"hashTitle\":\"#Regression\",\"rating\":3.3333333333333335,\"year\":2015,\"sentiment\":0.2877906976744186}",
      "{\"movieId\":132906,\"title\":\"The Man with the Iron Fists 2 \",\"hashTitle\":\"#TheManwiththeIronFists2\",\"rating\":2.5384615384615383,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":132961,\"title\":\"Far from the Madding Crowd \",\"hashTitle\":\"#FarfromtheMaddingCrowd\",\"rating\":3.5873015873015874,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":133129,\"title\":\"Barbie in Princess Power \",\"hashTitle\":\"#BarbieinPrincessPower\",\"rating\":2.227272727272727,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":133183,\"title\":\"The Casual Vacancy \",\"hashTitle\":\"#TheCasualVacancy\",\"rating\":3.3333333333333335,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":133223,\"title\":\"One Eyed Girl \",\"hashTitle\":\"#OneEyedGirl\",\"rating\":3.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":133281,\"title\":\"Ricki and the Flash \",\"hashTitle\":\"#RickiandtheFlash\",\"rating\":2.857142857142857,\"year\":2015,\"sentiment\":-0.6666666666666666}",
      "{\"movieId\":133319,\"title\":\"Resistance \",\"hashTitle\":\"#Resistance\",\"rating\":3.0,\"year\":2015,\"sentiment\":-0.13365990202939118}",
      "{\"movieId\":133339,\"title\":\"1915 \",\"hashTitle\":\"#1915\",\"rating\":3.6666666666666665,\"year\":2015,\"sentiment\":-0.4057377049180328}",
      "{\"movieId\":133347,\"title\":\"Ride \",\"hashTitle\":\"#Ride\",\"rating\":3.65,\"year\":2015,\"sentiment\":-0.1080168776371308}",
      "{\"movieId\":133349,\"title\":\"The Eichmann Show \",\"hashTitle\":\"#TheEichmannShow\",\"rating\":3.357142857142857,\"year\":2015,\"sentiment\":-0.5}",
      "{\"movieId\":133365,\"title\":\"Partisan \",\"hashTitle\":\"#Partisan\",\"rating\":3.3125,\"year\":2015,\"sentiment\":-0.5714285714285714}",
      "{\"movieId\":133377,\"title\":\"Infini \",\"hashTitle\":\"#Infini\",\"rating\":2.8666666666666667,\"year\":2015,\"sentiment\":-0.7050359712230215}",
      "{\"movieId\":133389,\"title\":\"Piku \",\"hashTitle\":\"#Piku\",\"rating\":3.4054054054054053,\"year\":2015,\"sentiment\":0.3360128617363344}",
      "{\"movieId\":133399,\"title\":\"German Angst \",\"hashTitle\":\"#GermanAngst\",\"rating\":4.0,\"year\":2015,\"sentiment\":0.045454545454545456}",
      "{\"movieId\":133417,\"title\":\"Luokkakokous \",\"hashTitle\":\"#Luokkakokous\",\"rating\":1.8846153846153846,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":133419,\"title\":\"Pitch Perfect 2 \",\"hashTitle\":\"#PitchPerfect2\",\"rating\":3.2655172413793103,\"year\":2015,\"sentiment\":-1.3733826247689465}",
      "{\"movieId\":133547,\"title\":\"El bosque de Karadima \",\"hashTitle\":\"#ElbosquedeKaradima\",\"rating\":2.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":133583,\"title\":\"Bessie \",\"hashTitle\":\"#Bessie\",\"rating\":3.2333333333333334,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":133602,\"title\":\"Nightingale \",\"hashTitle\":\"#Nightingale\",\"rating\":4.071428571428571,\"year\":2015,\"sentiment\":-0.09523809523809523}",
      "{\"movieId\":133645,\"title\":\"Carol \",\"hashTitle\":\"#Carol\",\"rating\":3.6607142857142856,\"year\":2015,\"sentiment\":-0.656043295249549}",
      "{\"movieId\":133647,\"title\":\"Thought Crimes \",\"hashTitle\":\"#ThoughtCrimes\",\"rating\":3.0625,\"year\":2015,\"sentiment\":-2.75}",
      "{\"movieId\":133689,\"title\":\"Pound of Flesh \",\"hashTitle\":\"#PoundofFlesh\",\"rating\":2.3214285714285716,\"year\":2015,\"sentiment\":1.5}",
      "{\"movieId\":133710,\"title\":\"Strangerland \",\"hashTitle\":\"#Strangerland\",\"rating\":2.6333333333333333,\"year\":2015,\"sentiment\":-3.6666666666666665}",
      "{\"movieId\":133753,\"title\":\"Teacher of the Year \",\"hashTitle\":\"#TeacheroftheYear\",\"rating\":2.9722222222222223,\"year\":2015,\"sentiment\":-0.45384615384615384}",
      "{\"movieId\":133771,\"title\":\"The Lobster \",\"hashTitle\":\"#TheLobster\",\"rating\":3.7564102564102564,\"year\":2015,\"sentiment\":-1.7981379602200593}",
      "{\"movieId\":133773,\"title\":\"Beautiful and Twisted \",\"hashTitle\":\"#BeautifulandTwisted\",\"rating\":2.3333333333333335,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":133782,\"title\":\"Maggie \",\"hashTitle\":\"#Maggie\",\"rating\":2.7,\"year\":2015,\"sentiment\":-0.25}",
      "{\"movieId\":133798,\"title\":\"Hot Pursuit \",\"hashTitle\":\"#HotPursuit\",\"rating\":2.611111111111111,\"year\":2015,\"sentiment\":0.022727272727272728}",
      "{\"movieId\":133802,\"title\":\"Slow West \",\"hashTitle\":\"#SlowWest\",\"rating\":3.5618556701030926,\"year\":2015,\"sentiment\":0.875222816399287}",
      "{\"movieId\":133824,\"title\":\"The Human Centipede III (Final Sequence) \",\"hashTitle\":\"#TheHumanCentipedeIII(FinalSequence)\",\"rating\":1.6296296296296295,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":133835,\"title\":\"Just About Famous \",\"hashTitle\":\"#JustAboutFamous\",\"rating\":3.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":133859,\"title\":\"Deli Man \",\"hashTitle\":\"#DeliMan\",\"rating\":3.6666666666666665,\"year\":2015,\"sentiment\":2.5}",
      "{\"movieId\":133865,\"title\":\"Southern Rites \",\"hashTitle\":\"#SouthernRites\",\"rating\":3.2857142857142856,\"year\":2015,\"sentiment\":3.0}",
      "{\"movieId\":133867,\"title\":\"Barely Lethal \",\"hashTitle\":\"#BarelyLethal\",\"rating\":3.142857142857143,\"year\":2015,\"sentiment\":-0.5555555555555556}",
      "{\"movieId\":133873,\"title\":\"The Fencer \",\"hashTitle\":\"#TheFencer\",\"rating\":3.4285714285714284,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":133945,\"title\":\"Deep Web \",\"hashTitle\":\"#DeepWeb\",\"rating\":3.4411764705882355,\"year\":2015,\"sentiment\":-0.6680672268907563}",
      "{\"movieId\":134017,\"title\":\"You Are My Sunshine \",\"hashTitle\":\"#YouAreMySunshine\",\"rating\":2.5,\"year\":2015,\"sentiment\":1.8484848484848484}",
      "{\"movieId\":134117,\"title\":\"San Andreas Quake \",\"hashTitle\":\"#SanAndreasQuake\",\"rating\":1.7142857142857142,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":134158,\"title\":\"Return to Sender \",\"hashTitle\":\"#ReturntoSender\",\"rating\":2.5555555555555554,\"year\":2015,\"sentiment\":-2.0}",
      "{\"movieId\":134170,\"title\":\"Kung Fury \",\"hashTitle\":\"#KungFury\",\"rating\":3.603711790393013,\"year\":2015,\"sentiment\":-0.06976744186046512}",
      "{\"movieId\":134178,\"title\":\"Detective Byomkesh Bakshy \",\"hashTitle\":\"#DetectiveByomkeshBakshy\",\"rating\":3.642857142857143,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":134180,\"title\":\"Badlapur \",\"hashTitle\":\"#Badlapur\",\"rating\":3.0555555555555554,\"year\":2015,\"sentiment\":-0.15172413793103448}",
      "{\"movieId\":134214,\"title\":\"Youth \",\"hashTitle\":\"#Youth\",\"rating\":3.6296296296296298,\"year\":2015,\"sentiment\":-0.16772530608487526}",
      "{\"movieId\":134246,\"title\":\"Survivor \",\"hashTitle\":\"#Survivor\",\"rating\":3.0846153846153848,\"year\":2015,\"sentiment\":-0.011781934367303468}",
      "{\"movieId\":134248,\"title\":\"Hot Girls Wanted \",\"hashTitle\":\"#HotGirlsWanted\",\"rating\":3.103896103896104,\"year\":2015,\"sentiment\":-0.75}",
      "{\"movieId\":134360,\"title\":\"A Gift of Miracles \",\"hashTitle\":\"#AGiftofMiracles\",\"rating\":0.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":134362,\"title\":\"Curse of the Witching Tree \",\"hashTitle\":\"#CurseoftheWitchingTree\",\"rating\":2.3333333333333335,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":134368,\"title\":\"Spy \",\"hashTitle\":\"#Spy\",\"rating\":3.558894230769231,\"year\":2015,\"sentiment\":-0.3123644251626898}",
      "{\"movieId\":134393,\"title\":\"Trainwreck \",\"hashTitle\":\"#Trainwreck\",\"rating\":3.224400871459695,\"year\":2015,\"sentiment\":-1.277533039647577}",
      "{\"movieId\":134519,\"title\":\"Suspicious Truth \",\"hashTitle\":\"#SuspiciousTruth\",\"rating\":3.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":134528,\"title\":\"Aloha \",\"hashTitle\":\"#Aloha\",\"rating\":2.6538461538461537,\"year\":2015,\"sentiment\":0.054380664652567974}",
      "{\"movieId\":134583,\"title\":\"Misery Loves Comedy \",\"hashTitle\":\"#MiseryLovesComedy\",\"rating\":3.4444444444444446,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":134629,\"title\":\"Flight World War II \",\"hashTitle\":\"#FlightWorldWarII\",\"rating\":2.25,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":134680,\"title\":\"Taxi \",\"hashTitle\":\"#Taxi\",\"rating\":4.05,\"year\":2015,\"sentiment\":-2.5393628707433176}",
      "{\"movieId\":134775,\"title\":\"Dragon Blade \",\"hashTitle\":\"#DragonBlade\",\"rating\":2.772727272727273,\"year\":2015,\"sentiment\":-0.16666666666666666}",
      "{\"movieId\":134783,\"title\":\"Entourage \",\"hashTitle\":\"#Entourage\",\"rating\":3.0654205607476634,\"year\":2015,\"sentiment\":-1.1482558139534884}",
      "{\"movieId\":134785,\"title\":\"London Road \",\"hashTitle\":\"#LondonRoad\",\"rating\":3.25,\"year\":2015,\"sentiment\":-0.2545454545454545}",
      "{\"movieId\":134796,\"title\":\"Bitter Lake \",\"hashTitle\":\"#BitterLake\",\"rating\":3.9791666666666665,\"year\":2015,\"sentiment\":-0.56}",
      "{\"movieId\":134800,\"title\":\"Ventoux \",\"hashTitle\":\"#Ventoux\",\"rating\":3.5,\"year\":2015,\"sentiment\":-0.07936507936507936}",
      "{\"movieId\":134808,\"title\":\"No Way Jose \",\"hashTitle\":\"#NoWayJose\",\"rating\":3.0,\"year\":2015,\"sentiment\":-0.2545454545454545}",
      "{\"movieId\":134853,\"title\":\"Inside Out \",\"hashTitle\":\"#InsideOut\",\"rating\":4.01651376146789,\"year\":2015,\"sentiment\":-0.2586767895878525}",
      "{\"movieId\":134855,\"title\":\"The World Made Straight \",\"hashTitle\":\"#TheWorldMadeStraight\",\"rating\":4.25,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":134859,\"title\":\"The Wolfpack \",\"hashTitle\":\"#TheWolfpack\",\"rating\":3.3815789473684212,\"year\":2015,\"sentiment\":1.0}",
      "{\"movieId\":134871,\"title\":\"The Sisterhood of Night \",\"hashTitle\":\"#TheSisterhoodofNight\",\"rating\":3.357142857142857,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":135135,\"title\":\"Max \",\"hashTitle\":\"#Max\",\"rating\":3.0454545454545454,\"year\":2015,\"sentiment\":-1.4688597892047268}",
      "{\"movieId\":135137,\"title\":\"Pixels \",\"hashTitle\":\"#Pixels\",\"rating\":2.7031746031746033,\"year\":2015,\"sentiment\":0.653968253968254}",
      "{\"movieId\":135178,\"title\":\"Dawg Fight \",\"hashTitle\":\"#DawgFight\",\"rating\":2.8333333333333335,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":135200,\"title\":\"Chocolate City \",\"hashTitle\":\"#ChocolateCity\",\"rating\":4.0,\"year\":2015,\"sentiment\":0.16923076923076924}",
      "{\"movieId\":135224,\"title\":\"Hamari Adhuri Kahaani \",\"hashTitle\":\"#HamariAdhuriKahaani\",\"rating\":1.625,\"year\":2015,\"sentiment\":-1.25}",
      "{\"movieId\":135238,\"title\":\"The Sky Above Us \",\"hashTitle\":\"#TheSkyAboveUs\",\"rating\":4.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":135468,\"title\":\"Senior Project \",\"hashTitle\":\"#SeniorProject\",\"rating\":3.0,\"year\":2015,\"sentiment\":-0.7164179104477612}",
      "{\"movieId\":135492,\"title\":\"Kaaka Muttai \",\"hashTitle\":\"#KaakaMuttai\",\"rating\":4.333333333333333,\"year\":2015,\"sentiment\":-0.8620689655172413}",
      "{\"movieId\":135500,\"title\":\"Gabbar Is Back \",\"hashTitle\":\"#GabbarIsBack\",\"rating\":2.125,\"year\":2015,\"sentiment\":-0.038461538461538464}",
      "{\"movieId\":135504,\"title\":\"Little Boy \",\"hashTitle\":\"#LittleBoy\",\"rating\":3.6973684210526314,\"year\":2015,\"sentiment\":-0.265625}",
      "{\"movieId\":135508,\"title\":\"A Deadly Adoption \",\"hashTitle\":\"#ADeadlyAdoption\",\"rating\":2.3529411764705883,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":135532,\"title\":\"The Last Witch Hunter \",\"hashTitle\":\"#TheLastWitchHunter\",\"rating\":2.908450704225352,\"year\":2015,\"sentiment\":-1.1914893617021276}",
      "{\"movieId\":135534,\"title\":\"Krampus \",\"hashTitle\":\"#Krampus\",\"rating\":2.8365384615384617,\"year\":2015,\"sentiment\":-0.525}",
      "{\"movieId\":135539,\"title\":\"Aurora \",\"hashTitle\":\"#Aurora\",\"rating\":2.8333333333333335,\"year\":2015,\"sentiment\":-0.33679566136593436}",
      "{\"movieId\":135625,\"title\":\"Final Girl \",\"hashTitle\":\"#FinalGirl\",\"rating\":2.8214285714285716,\"year\":2015,\"sentiment\":-0.9285714285714286}",
      "{\"movieId\":135643,\"title\":\"The Disappointments Room \",\"hashTitle\":\"#TheDisappointmentsRoom\",\"rating\":3.75,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":135699,\"title\":\"Grace Stirs Up Success \",\"hashTitle\":\"#GraceStirsUpSuccess\",\"rating\":1.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":135861,\"title\":\"Ted 2 \",\"hashTitle\":\"#Ted2\",\"rating\":3.0262008733624453,\"year\":2015,\"sentiment\":0.10227272727272728}",
      "{\"movieId\":135885,\"title\":\"Absolutely Anything \",\"hashTitle\":\"#AbsolutelyAnything\",\"rating\":2.8095238095238093,\"year\":2015,\"sentiment\":-1.375}",
      "{\"movieId\":135887,\"title\":\"Minions \",\"hashTitle\":\"#Minions\",\"rating\":3.246978851963746,\"year\":2015,\"sentiment\":0.22474596533173938}",
      "{\"movieId\":136016,\"title\":\"The Good Dinosaur \",\"hashTitle\":\"#TheGoodDinosaur\",\"rating\":3.467032967032967,\"year\":2015,\"sentiment\":-0.148}",
      "{\"movieId\":136018,\"title\":\"Black Mass \",\"hashTitle\":\"#BlackMass\",\"rating\":3.34375,\"year\":2015,\"sentiment\":-0.8232323232323232}",
      "{\"movieId\":136020,\"title\":\"Spectre \",\"hashTitle\":\"#Spectre\",\"rating\":3.348710990502035,\"year\":2015,\"sentiment\":-0.30284552845528456}",
      "{\"movieId\":136204,\"title\":\"The Second Mother \",\"hashTitle\":\"#TheSecondMother\",\"rating\":4.076086956521739,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136257,\"title\":\"Avengers Grimm \",\"hashTitle\":\"#AvengersGrimm\",\"rating\":1.1428571428571428,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":136509,\"title\":\"Little Big Master \",\"hashTitle\":\"#LittleBigMaster\",\"rating\":4.0,\"year\":2015,\"sentiment\":-4.0}",
      "{\"movieId\":136524,\"title\":\"The Amityville Playhouse \",\"hashTitle\":\"#TheAmityvillePlayhouse\",\"rating\":1.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136562,\"title\":\"Steve Jobs \",\"hashTitle\":\"#SteveJobs\",\"rating\":3.3624161073825505,\"year\":2015,\"sentiment\":-0.897445124145376}",
      "{\"movieId\":136564,\"title\":\"Macbeth \",\"hashTitle\":\"#Macbeth\",\"rating\":3.5319148936170213,\"year\":2015,\"sentiment\":-0.6011846001974334}",
      "{\"movieId\":136598,\"title\":\"Vacation \",\"hashTitle\":\"#Vacation\",\"rating\":3.2565789473684212,\"year\":2015,\"sentiment\":-0.26891256150976045}",
      "{\"movieId\":136632,\"title\":\"Jurassic City \",\"hashTitle\":\"#JurassicCity\",\"rating\":2.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136640,\"title\":\"Back to the Jurassic \",\"hashTitle\":\"#BacktotheJurassic\",\"rating\":3.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136652,\"title\":\"Phantom Halo \",\"hashTitle\":\"#PhantomHalo\",\"rating\":3.2,\"year\":2015,\"sentiment\":0.40625}",
      "{\"movieId\":136654,\"title\":\"The Face of an Angel \",\"hashTitle\":\"#TheFaceofanAngel\",\"rating\":2.4,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136664,\"title\":\"Wild Horses \",\"hashTitle\":\"#WildHorses\",\"rating\":3.0,\"year\":2015,\"sentiment\":-0.5587583148558758}",
      "{\"movieId\":136678,\"title\":\"Tooken \",\"hashTitle\":\"#Tooken\",\"rating\":0.75,\"year\":2015,\"sentiment\":-0.5}",
      "{\"movieId\":136680,\"title\":\"Battle For SkyArk \",\"hashTitle\":\"#BattleForSkyArk\",\"rating\":1.9166666666666667,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136686,\"title\":\"After the Ball \",\"hashTitle\":\"#AftertheBall\",\"rating\":3.25,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136688,\"title\":\"Private Number \",\"hashTitle\":\"#PrivateNumber\",\"rating\":2.25,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":136694,\"title\":\"See You In Valhalla \",\"hashTitle\":\"#SeeYouInValhalla\",\"rating\":2.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136696,\"title\":\"Absolution \",\"hashTitle\":\"#Absolution\",\"rating\":2.0,\"year\":2015,\"sentiment\":-1.4213197969543148}",
      "{\"movieId\":136702,\"title\":\"The Four Warriors \",\"hashTitle\":\"#TheFourWarriors\",\"rating\":1.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136724,\"title\":\"Dial a Prayer \",\"hashTitle\":\"#DialaPrayer\",\"rating\":2.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136726,\"title\":\"The Last Time You Had Fun \",\"hashTitle\":\"#TheLastTimeYouHadFun\",\"rating\":2.75,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136736,\"title\":\"Faith of Our Fathers \",\"hashTitle\":\"#FaithofOurFathers\",\"rating\":2.1,\"year\":2015,\"sentiment\":-0.6}",
      "{\"movieId\":136754,\"title\":\"Champs \",\"hashTitle\":\"#Champs\",\"rating\":3.142857142857143,\"year\":2015,\"sentiment\":0.13680781758957655}",
      "{\"movieId\":136776,\"title\":\"Fishing Naked \",\"hashTitle\":\"#FishingNaked\",\"rating\":3.0,\"year\":2015,\"sentiment\":1.0}",
      "{\"movieId\":136778,\"title\":\"The Squeeze \",\"hashTitle\":\"#TheSqueeze\",\"rating\":3.75,\"year\":2015,\"sentiment\":-0.43636363636363634}",
      "{\"movieId\":136784,\"title\":\"From the Dark \",\"hashTitle\":\"#FromtheDark\",\"rating\":3.3333333333333335,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136786,\"title\":\"Careful What You Wish For \",\"hashTitle\":\"#CarefulWhatYouWishFor\",\"rating\":3.2857142857142856,\"year\":2015,\"sentiment\":-0.921875}",
      "{\"movieId\":136788,\"title\":\"Any Day \",\"hashTitle\":\"#AnyDay\",\"rating\":2.0,\"year\":2015,\"sentiment\":-1.5234375}",
      "{\"movieId\":136804,\"title\":\"Russell Madness \",\"hashTitle\":\"#RussellMadness\",\"rating\":1.3333333333333333,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136812,\"title\":\"The Millennials \",\"hashTitle\":\"#TheMillennials\",\"rating\":4.5,\"year\":2015,\"sentiment\":-0.14285714285714285}",
      "{\"movieId\":136816,\"title\":\"Bad Asses on the Bayou \",\"hashTitle\":\"#BadAssesontheBayou\",\"rating\":3.375,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136818,\"title\":\"Silent Retreat \",\"hashTitle\":\"#SilentRetreat\",\"rating\":2.0,\"year\":2015,\"sentiment\":-5.0}",
      "{\"movieId\":136859,\"title\":\"The Lovers \",\"hashTitle\":\"#TheLovers\",\"rating\":1.9,\"year\":2015,\"sentiment\":-0.041666666666666664}",
      "{\"movieId\":136916,\"title\":\"Vendetta \",\"hashTitle\":\"#Vendetta\",\"rating\":3.5,\"year\":2015,\"sentiment\":-0.09774436090225563}",
      "{\"movieId\":136918,\"title\":\"Age Of Kill \",\"hashTitle\":\"#AgeOfKill\",\"rating\":3.3333333333333335,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136922,\"title\":\"Bordering on Bad Behavior \",\"hashTitle\":\"#BorderingonBadBehavior\",\"rating\":0.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":136936,\"title\":\"88 \",\"hashTitle\":\"#88\",\"rating\":2.3,\"year\":2015,\"sentiment\":-0.4765378069535619}",
      "{\"movieId\":136998,\"title\":\"The Wrong Girl \",\"hashTitle\":\"#TheWrongGirl\",\"rating\":5.0,\"year\":2015,\"sentiment\":-0.5}",
      "{\"movieId\":137034,\"title\":\"Perfect High \",\"hashTitle\":\"#PerfectHigh\",\"rating\":3.4285714285714284,\"year\":2015,\"sentiment\":0.2631578947368421}",
      "{\"movieId\":137278,\"title\":\"Cyberbully \",\"hashTitle\":\"#Cyberbully\",\"rating\":3.8181818181818183,\"year\":2015,\"sentiment\":-2.0307692307692307}",
      "{\"movieId\":137337,\"title\":\"Amy \",\"hashTitle\":\"#Amy\",\"rating\":3.91044776119403,\"year\":2015,\"sentiment\":-0.08447802197802198}",
      "{\"movieId\":137563,\"title\":\"Stung \",\"hashTitle\":\"#Stung\",\"rating\":2.6785714285714284,\"year\":2015,\"sentiment\":-0.5333333333333333}",
      "{\"movieId\":137595,\"title\":\"Magic Mike XXL \",\"hashTitle\":\"#MagicMikeXXL\",\"rating\":2.9266666666666667,\"year\":2015,\"sentiment\":0.08713692946058091}",
      "{\"movieId\":137612,\"title\":\"Babai \",\"hashTitle\":\"#Babai\",\"rating\":4.833333333333333,\"year\":2015,\"sentiment\":-0.38461538461538464}",
      "{\"movieId\":137715,\"title\":\"Rey Gitano \",\"hashTitle\":\"#ReyGitano\",\"rating\":2.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":137873,\"title\":\"Stonemouth \",\"hashTitle\":\"#Stonemouth\",\"rating\":3.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":137900,\"title\":\"Accidental Love \",\"hashTitle\":\"#AccidentalLove\",\"rating\":0.75,\"year\":2015,\"sentiment\":-2.0}",
      "{\"movieId\":137920,\"title\":\"Bombay Velvet \",\"hashTitle\":\"#BombayVelvet\",\"rating\":2.25,\"year\":2015,\"sentiment\":-1.458762886597938}",
      "{\"movieId\":138030,\"title\":\"The Chinese Mayor \",\"hashTitle\":\"#TheChineseMayor\",\"rating\":3.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":138038,\"title\":\"The Widowmaker \",\"hashTitle\":\"#TheWidowmaker\",\"rating\":3.25,\"year\":2015,\"sentiment\":-2.0}",
      "{\"movieId\":138180,\"title\":\"All Eyes And Ears \",\"hashTitle\":\"#AllEyesAndEars\",\"rating\":2.5,\"year\":2015,\"sentiment\":-2.0}",
      "{\"movieId\":138186,\"title\":\"Sorrow \",\"hashTitle\":\"#Sorrow\",\"rating\":0.5,\"year\":2015,\"sentiment\":0.053833605220228384}",
      "{\"movieId\":138202,\"title\":\"Burying the Ex \",\"hashTitle\":\"#BuryingtheEx\",\"rating\":2.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":138204,\"title\":\"7 Days in Hell \",\"hashTitle\":\"#7DaysinHell\",\"rating\":3.147887323943662,\"year\":2015,\"sentiment\":-0.5}",
      "{\"movieId\":138206,\"title\":\"Echoes of War \",\"hashTitle\":\"#EchoesofWar\",\"rating\":3.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":138210,\"title\":\"13 Hours \",\"hashTitle\":\"#13Hours\",\"rating\":2.9761904761904763,\"year\":2016,\"sentiment\":-0.3460104399701715}",
      "{\"movieId\":138230,\"title\":\"Staten Island Summer \",\"hashTitle\":\"#StatenIslandSummer\",\"rating\":2.9305555555555554,\"year\":2015,\"sentiment\":-0.25}",
      "{\"movieId\":138258,\"title\":\"Nasty Baby \",\"hashTitle\":\"#NastyBaby\",\"rating\":2.8125,\"year\":2015,\"sentiment\":-1.2}",
      "{\"movieId\":138260,\"title\":\"Bad Night \",\"hashTitle\":\"#BadNight\",\"rating\":0.5,\"year\":2015,\"sentiment\":-0.75}",
      "{\"movieId\":138958,\"title\":\"Wuthering High \",\"hashTitle\":\"#WutheringHigh\",\"rating\":1.5,\"year\":2015,\"sentiment\":1.0}",
      "{\"movieId\":139046,\"title\":\"My Golden Days \",\"hashTitle\":\"#MyGoldenDays\",\"rating\":3.625,\"year\":2015,\"sentiment\":-2.0}",
      "{\"movieId\":139052,\"title\":\"Dark Places \",\"hashTitle\":\"#DarkPlaces\",\"rating\":3.076923076923077,\"year\":2015,\"sentiment\":0.19444444444444445}",
      "{\"movieId\":139120,\"title\":\"Mustang \",\"hashTitle\":\"#Mustang\",\"rating\":3.825,\"year\":2015,\"sentiment\":0.006666666666666667}",
      "{\"movieId\":139124,\"title\":\"Microbe et Gasoil \",\"hashTitle\":\"#MicrobeetGasoil\",\"rating\":3.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":139148,\"title\":\"Bajrangi Bhaijaan \",\"hashTitle\":\"#BajrangiBhaijaan\",\"rating\":3.2,\"year\":2015,\"sentiment\":-0.06822429906542056}",
      "{\"movieId\":139153,\"title\":\"Eli \",\"hashTitle\":\"#Eli\",\"rating\":3.5,\"year\":2015,\"sentiment\":-0.17921830314585319}",
      "{\"movieId\":139157,\"title\":\"Massu Engira Maasilamani \",\"hashTitle\":\"#MassuEngiraMaasilamani\",\"rating\":0.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":139205,\"title\":\"Tanu Weds Manu Returns \",\"hashTitle\":\"#TanuWedsManuReturns\",\"rating\":3.5714285714285716,\"year\":2015,\"sentiment\":-0.48148148148148145}",
      "{\"movieId\":139251,\"title\":\"Sweet Lorraine \",\"hashTitle\":\"#SweetLorraine\",\"rating\":4.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":139311,\"title\":\"Road Wars \",\"hashTitle\":\"#RoadWars\",\"rating\":3.3333333333333335,\"year\":2015,\"sentiment\":-0.25}",
      "{\"movieId\":139313,\"title\":\"Awaken \",\"hashTitle\":\"#Awaken\",\"rating\":1.25,\"year\":2015,\"sentiment\":-0.16483516483516483}",
      "{\"movieId\":139317,\"title\":\"Pressure \",\"hashTitle\":\"#Pressure\",\"rating\":3.0384615384615383,\"year\":2015,\"sentiment\":-0.8729662077596996}",
      "{\"movieId\":139319,\"title\":\"American Justice \",\"hashTitle\":\"#AmericanJustice\",\"rating\":3.5,\"year\":2015,\"sentiment\":-0.3181818181818182}",
      "{\"movieId\":139321,\"title\":\"Unknown Caller \",\"hashTitle\":\"#UnknownCaller\",\"rating\":2.5,\"year\":2015,\"sentiment\":-0.6666666666666666}",
      "{\"movieId\":139383,\"title\":\"Legacy \",\"hashTitle\":\"#Legacy\",\"rating\":3.25,\"year\":2015,\"sentiment\":-0.32981153626499143}",
      "{\"movieId\":139385,\"title\":\"The Revenant \",\"hashTitle\":\"#TheRevenant\",\"rating\":3.929372197309417,\"year\":2015,\"sentiment\":-0.2893226176808266}",
      "{\"movieId\":139415,\"title\":\"Irrational Man \",\"hashTitle\":\"#IrrationalMan\",\"rating\":3.361111111111111,\"year\":2015,\"sentiment\":1.6}",
      "{\"movieId\":139417,\"title\":\"Tale of Tales \",\"hashTitle\":\"#TaleofTales\",\"rating\":2.913793103448276,\"year\":2015,\"sentiment\":0.058823529411764705}",
      "{\"movieId\":139423,\"title\":\"Cleveland Abduction \",\"hashTitle\":\"#ClevelandAbduction\",\"rating\":3.5,\"year\":2015,\"sentiment\":0.6666666666666666}",
      "{\"movieId\":139501,\"title\":\"Carte Blanche \",\"hashTitle\":\"#CarteBlanche\",\"rating\":3.1666666666666665,\"year\":2015,\"sentiment\":-0.8067729083665338}",
      "{\"movieId\":139525,\"title\":\"Cartel Land \",\"hashTitle\":\"#CartelLand\",\"rating\":3.3636363636363638,\"year\":2015,\"sentiment\":-0.75}",
      "{\"movieId\":139600,\"title\":\"Snow in Paradise \",\"hashTitle\":\"#SnowinParadise\",\"rating\":4.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":139626,\"title\":\"The Human Experiment \",\"hashTitle\":\"#TheHumanExperiment\",\"rating\":3.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":139634,\"title\":\"The True Cost \",\"hashTitle\":\"#TheTrueCost\",\"rating\":3.4,\"year\":2015,\"sentiment\":-1.3829787234042554}",
      "{\"movieId\":139642,\"title\":\"Southpaw \",\"hashTitle\":\"#Southpaw\",\"rating\":3.44314381270903,\"year\":2015,\"sentiment\":-0.17682926829268292}",
      "{\"movieId\":139644,\"title\":\"Sicario \",\"hashTitle\":\"#Sicario\",\"rating\":3.816190476190476,\"year\":2015,\"sentiment\":0.5947136563876652}",
      "{\"movieId\":139651,\"title\":\"The Bride He Bought Online \",\"hashTitle\":\"#TheBrideHeBoughtOnline\",\"rating\":1.75,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":139715,\"title\":\"War Pigs \",\"hashTitle\":\"#WarPigs\",\"rating\":2.6153846153846154,\"year\":2015,\"sentiment\":-0.47058823529411764}",
      "{\"movieId\":139717,\"title\":\"10 Cent Pistol \",\"hashTitle\":\"#10CentPistol\",\"rating\":0.5,\"year\":2015,\"sentiment\":-0.5}",
      "{\"movieId\":139757,\"title\":\"Best of Enemies \",\"hashTitle\":\"#BestofEnemies\",\"rating\":3.6538461538461537,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":139759,\"title\":\"Lavalantula \",\"hashTitle\":\"#Lavalantula\",\"rating\":2.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":139771,\"title\":\"Chloe and Theo \",\"hashTitle\":\"#ChloeandTheo\",\"rating\":3.75,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":139779,\"title\":\"The Phoenix Project \",\"hashTitle\":\"#ThePhoenixProject\",\"rating\":1.3333333333333333,\"year\":2015,\"sentiment\":-0.4}",
      "{\"movieId\":139847,\"title\":\"Chevalier \",\"hashTitle\":\"#Chevalier\",\"rating\":4.0,\"year\":2015,\"sentiment\":-5.7272727272727275}",
      "{\"movieId\":139855,\"title\":\"Anomalisa \",\"hashTitle\":\"#Anomalisa\",\"rating\":3.5677966101694913,\"year\":2015,\"sentiment\":-0.47058823529411764}",
      "{\"movieId\":139857,\"title\":\"Colonia \",\"hashTitle\":\"#Colonia\",\"rating\":3.15,\"year\":2016,\"sentiment\":-0.29411764705882354}",
      "{\"movieId\":139897,\"title\":\"Somewhere Only We Know \",\"hashTitle\":\"#SomewhereOnlyWeKnow\",\"rating\":3.0,\"year\":2015,\"sentiment\":0.16666666666666666}",
      "{\"movieId\":139901,\"title\":\"Triumph in the Skies \",\"hashTitle\":\"#TriumphintheSkies\",\"rating\":2.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":140074,\"title\":\"The Vatican Tapes \",\"hashTitle\":\"#TheVaticanTapes\",\"rating\":2.1818181818181817,\"year\":2015,\"sentiment\":-0.2}",
      "{\"movieId\":140098,\"title\":\"Runoff \",\"hashTitle\":\"#Runoff\",\"rating\":2.5,\"year\":2015,\"sentiment\":-0.5454545454545454}",
      "{\"movieId\":140106,\"title\":\"Our Little Sister \",\"hashTitle\":\"#OurLittleSister\",\"rating\":3.5,\"year\":2015,\"sentiment\":-0.52}",
      "{\"movieId\":140108,\"title\":\"Yakuza Apocalypse \",\"hashTitle\":\"#YakuzaApocalypse\",\"rating\":4.0,\"year\":2015,\"sentiment\":-0.022388059701492536}",
      "{\"movieId\":140131,\"title\":\"Extinction \",\"hashTitle\":\"#Extinction\",\"rating\":3.1739130434782608,\"year\":2015,\"sentiment\":-0.94026284348865}",
      "{\"movieId\":140146,\"title\":\"The Suicide Theory \",\"hashTitle\":\"#TheSuicideTheory\",\"rating\":3.1666666666666665,\"year\":2015,\"sentiment\":-4.0}",
      "{\"movieId\":140152,\"title\":\"Dreamcatcher \",\"hashTitle\":\"#Dreamcatcher\",\"rating\":3.0,\"year\":2015,\"sentiment\":0.07692307692307693}",
      "{\"movieId\":140160,\"title\":\"Descendants \",\"hashTitle\":\"#Descendants\",\"rating\":2.767857142857143,\"year\":2015,\"sentiment\":-0.23947151114781173}",
      "{\"movieId\":140162,\"title\":\"Love \",\"hashTitle\":\"#Love\",\"rating\":3.225,\"year\":2015,\"sentiment\":0.16390247040658776}",
      "{\"movieId\":140174,\"title\":\"Room \",\"hashTitle\":\"#Room\",\"rating\":3.9471153846153846,\"year\":2015,\"sentiment\":-0.16722929109322254}",
      "{\"movieId\":140204,\"title\":\"Backmask \",\"hashTitle\":\"#Backmask\",\"rating\":1.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":140237,\"title\":\"The Runner \",\"hashTitle\":\"#TheRunner\",\"rating\":2.933333333333333,\"year\":2015,\"sentiment\":-1.5041322314049588}",
      "{\"movieId\":140245,\"title\":\"Twenty \",\"hashTitle\":\"#Twenty\",\"rating\":3.1666666666666665,\"year\":2015,\"sentiment\":-0.23893805309734514}",
      "{\"movieId\":140247,\"title\":\"The Gift \",\"hashTitle\":\"#TheGift\",\"rating\":3.537777777777778,\"year\":2015,\"sentiment\":0.6858638743455497}",
      "{\"movieId\":140261,\"title\":\"Set Fire to the Stars \",\"hashTitle\":\"#SetFiretotheStars\",\"rating\":3.0,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":140267,\"title\":\"The Witch \",\"hashTitle\":\"#TheWitch\",\"rating\":3.3333333333333335,\"year\":2015,\"sentiment\":-1.7449238578680204}",
      "{\"movieId\":140291,\"title\":\"About Ray \",\"hashTitle\":\"#AboutRay\",\"rating\":3.6666666666666665,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":140301,\"title\":\"The Escort \",\"hashTitle\":\"#TheEscort\",\"rating\":3.5789473684210527,\"year\":2015,\"sentiment\":2.5}",
      "{\"movieId\":140309,\"title\":\"Uncle John \",\"hashTitle\":\"#UncleJohn\",\"rating\":3.5,\"year\":2015,\"sentiment\":-1.1428571428571428}",
      "{\"movieId\":140315,\"title\":\"Last Cab to Darwin \",\"hashTitle\":\"#LastCabtoDarwin\",\"rating\":4.05,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":140339,\"title\":\"Admiral \",\"hashTitle\":\"#Admiral\",\"rating\":2.75,\"year\":2015,\"sentiment\":-0.8881987577639752}",
      "{\"movieId\":140341,\"title\":\"Lava \",\"hashTitle\":\"#Lava\",\"rating\":3.2941176470588234,\"year\":2015,\"sentiment\":-0.07228915662650602}",
      "{\"movieId\":140525,\"title\":\"Secret in Their Eyes \",\"hashTitle\":\"#SecretinTheirEyes\",\"rating\":3.1538461538461537,\"year\":2015,\"sentiment\":1.0}",
      "{\"movieId\":140529,\"title\":\"Sinister 2 \",\"hashTitle\":\"#Sinister2\",\"rating\":2.723404255319149,\"year\":2015,\"sentiment\":-0.2391304347826087}",
      "{\"movieId\":140581,\"title\":\"I Am Chris Farley \",\"hashTitle\":\"#IAmChrisFarley\",\"rating\":3.5833333333333335,\"year\":2015,\"sentiment\":-0.5714285714285714}",
      "{\"movieId\":140627,\"title\":\"Battle For Sevastopol \",\"hashTitle\":\"#BattleForSevastopol\",\"rating\":3.8333333333333335,\"year\":2015,\"sentiment\":0.42857142857142855}",
      "{\"movieId\":140635,\"title\":\"Almost Mercy \",\"hashTitle\":\"#AlmostMercy\",\"rating\":2.25,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":140701,\"title\":\"Harbinger Down \",\"hashTitle\":\"#HarbingerDown\",\"rating\":2.4375,\"year\":2015,\"sentiment\":-1.5}",
      "{\"movieId\":140711,\"title\":\"American Ultra \",\"hashTitle\":\"#AmericanUltra\",\"rating\":3.086705202312139,\"year\":2015,\"sentiment\":-0.12121212121212122}",
      "{\"movieId\":140713,\"title\":\"No Escape \",\"hashTitle\":\"#NoEscape\",\"rating\":3.2580645161290325,\"year\":2015,\"sentiment\":-0.5432098765432098}",
      "{\"movieId\":140715,\"title\":\"Straight Outta Compton \",\"hashTitle\":\"#StraightOuttaCompton\",\"rating\":3.753448275862069,\"year\":2015,\"sentiment\":-0.4865424430641822}",
      "{\"movieId\":140725,\"title\":\"Cop Car \",\"hashTitle\":\"#CopCar\",\"rating\":3.310344827586207,\"year\":2015,\"sentiment\":0.5294117647058824}",
      "{\"movieId\":140773,\"title\":\"A LEGO Brickumentary \",\"hashTitle\":\"#ALEGOBrickumentary\",\"rating\":3.625,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":140777,\"title\":\"Pasolini \",\"hashTitle\":\"#Pasolini\",\"rating\":2.7,\"year\":2015,\"sentiment\":-0.3178294573643411}",
      "{\"movieId\":140805,\"title\":\"Attack on Titan \",\"hashTitle\":\"#AttackonTitan\",\"rating\":2.86,\"year\":2015,\"sentiment\":0.08849557522123894}",
      "{\"movieId\":140816,\"title\":\"Tangerine \",\"hashTitle\":\"#Tangerine\",\"rating\":3.7439024390243905,\"year\":2015,\"sentiment\":-1.143835616438356}",
      "{\"movieId\":140820,\"title\":\"Air \",\"hashTitle\":\"#Air\",\"rating\":2.78125,\"year\":2015,\"sentiment\":-0.4275797373358349}",
      "{\"movieId\":140844,\"title\":\"13 Minutes \",\"hashTitle\":\"#13Minutes\",\"rating\":3.5,\"year\":2015,\"sentiment\":2.0}",
      "{\"movieId\":140864,\"title\":\"Butterfly \",\"hashTitle\":\"#Butterfly\",\"rating\":5.0,\"year\":2015,\"sentiment\":-0.3823059725327371}",
      "{\"movieId\":140928,\"title\":\"Joy \",\"hashTitle\":\"#Joy\",\"rating\":3.008771929824561,\"year\":2015,\"sentiment\":0.26044188861985473}",
      "{\"movieId\":140962,\"title\":\"Amnesiac \",\"hashTitle\":\"#Amnesiac\",\"rating\":2.3333333333333335,\"year\":2015,\"sentiment\":-0.2608695652173913}",
      "{\"movieId\":141004,\"title\":\"Victor Frankenstein \",\"hashTitle\":\"#VictorFrankenstein\",\"rating\":3.0833333333333335,\"year\":2015,\"sentiment\":-0.3582089552238806}",
      "{\"movieId\":141054,\"title\":\"Journey To Space \",\"hashTitle\":\"#JourneyToSpace\",\"rating\":2.5,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":141058,\"title\":\"Manjhi The Mountain Man \",\"hashTitle\":\"#ManjhiTheMountainMan\",\"rating\":3.5555555555555554,\"year\":2015,\"sentiment\":-1.0}",
      "{\"movieId\":141060,\"title\":\"Fly Away Solo \",\"hashTitle\":\"#FlyAwaySolo\",\"rating\":4.375,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":141062,\"title\":\"Homies \",\"hashTitle\":\"#Homies\",\"rating\":2.0,\"year\":2015,\"sentiment\":-0.4358974358974359}",
      "{\"movieId\":141098,\"title\":\"Being Evel \",\"hashTitle\":\"#BeingEvel\",\"rating\":2.0,\"year\":2015,\"sentiment\":0.6666666666666666}",
      "{\"movieId\":141120,\"title\":\"Brothers \",\"hashTitle\":\"#Brothers\",\"rating\":2.8,\"year\":2015,\"sentiment\":-1.1222606689734718}",
      "{\"movieId\":141355,\"title\":\"The Spiderwebhouse \",\"hashTitle\":\"#TheSpiderwebhouse\",\"rating\":3.75,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":141393,\"title\":\"Kill Your Friends \",\"hashTitle\":\"#KillYourFriends\",\"rating\":3.0,\"year\":2015,\"sentiment\":-0.24}",
      "{\"movieId\":141395,\"title\":\"Nina Forever \",\"hashTitle\":\"#NinaForever\",\"rating\":1.5833333333333333,\"year\":2015,\"sentiment\":-1.9}",
      "{\"movieId\":141397,\"title\":\"Equals \",\"hashTitle\":\"#Equals\",\"rating\":3.0,\"year\":2015,\"sentiment\":-0.02578268876611418}",
      "{\"movieId\":141422,\"title\":\"Suffragette \",\"hashTitle\":\"#Suffragette\",\"rating\":3.5588235294117645,\"year\":2015,\"sentiment\":-1.032}",
      "{\"movieId\":141426,\"title\":\"Joker Game \",\"hashTitle\":\"#JokerGame\",\"rating\":3.0,\"year\":2015,\"sentiment\":-0.36752136752136755}",
      "{\"movieId\":141432,\"title\":\"Sweet Red Bean Paste \",\"hashTitle\":\"#SweetRedBeanPaste\",\"rating\":3.25,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":141485,\"title\":\"The High Sun \",\"hashTitle\":\"#TheHighSun\",\"rating\":3.8333333333333335,\"year\":2015,\"sentiment\":0.0}",
      "{\"movieId\":141536,\"title\":\"Veteran \",\"hashTitle\":\"#Veteran\",\"rating\":3.75,\"year\":2015,\"sentiment\":-0.5540275049115914}",
      "{\"movieId\":141538,\"title\":\"Assassination \",\"hashTitle\":\"#Assassination\",\"rating\":3.7083333333333335,\"year\":2015,\"sentiment\":-2.8955223880597014}",
      "{\"movieId\":141544,\"title\":\"Turbo Kid \",\"hashTitle\":\"#TurboKid\",\"rating\":3.3372093023255816,\"year\":2015,\"sentiment\":0.07692307692307693}",
      "{\"movieId\":141590,\"title\":\"Paulina \",\"hashTitle\":\"#Paulina\",\"rating\":3.25,\"year\":2015,\"sentiment\":0.16666666666666666}",
      "{\"movieId\":141630,\"title\":\"Bridgend \",\"hashTitle\":\"#Bridgend\",\"rating\":4.5,\"year\":2015,\"sentiment\":-0.45858761987794244}",
      "{\"movieId\":141632,\"title\":\"Zurich \",\"hashTitle\":\"#Zurich\",\"rating\":4.0,\"year\":2015,\"sentiment\":0.5229885057471264}",
      "{\"movieId\":141636,\"title\":\"Papanasam \",\"hashTitle\":\"#Papanasam\",\"rating\":4.0,\"year\":2015,\"sentiment\":-1.4328358208955223}"
    ],
    "Name": "Movies JSON"
  }

  var moviesToBeJsonified = movieJsonSrc["Movies"];
  var movies = [];
  var movieDataObjects = [];
  var ratingToSentCounter = {
    "0to2": 0,
    "2to3": 0,
    "3to5": 0
  };

  for (var i = 0; i < moviesToBeJsonified.length; i++) {
    var movieJsonObj = JSON.parse(moviesToBeJsonified[i]);
    if (!movieJsonObj.title.includes("Chevalier") && movieJsonObj.sentiment != 0 && movieJsonObj.rating != 0) {
      movies.push(movieJsonObj);
    }
  }

  for (var i = 0; i < movies.length; i++) {
    var sentiment = movies[i].sentiment;
    var rating = movies[i].rating;
    var title = movies[i].title.trim();
    var movieDataObj = {};

    movieDataObj.x = rating.toFixed(2);
    movieDataObj.y = sentiment.toFixed(2);
    movieDataObj.tooltext =
      title + "-> "
      + "rating: " + movieDataObj.x + ", "
      + "sentiment: " + movieDataObj.y;

    movieDataObjects.push(movieDataObj);

    if (sentiment >= 0.0 && sentiment <= 1.0) {
      if (rating < 2.0) {
        ratingToSentCounter["0to2"]++;
      }
      else if (rating < 3.0) {
        ratingToSentCounter["2to3"]++;
      }
      else {
        ratingToSentCounter["3to5"]++;
      }
    }
  }

  var pieDataObjects = [
    {
      "label": "Rating < 2.0",
      "value": ratingToSentCounter["0to2"]
    },
    {
      "label": "2.0 <= Rating < 3.0",
      "value": ratingToSentCounter["2to3"]
    },
    {
      "label": "Rating >= 3.0",
      "value": ratingToSentCounter["3to5"]
    },
  ];


  $scope.movieScatterData = {
    "chart": {
      "palette": "1",
      "caption": "Movie Data",
      "subcaption": "Rating vs Average Sentiment",
      "yaxisname": "Average Sentiment",
      "xaxisname": "Rating",
      "xaxismaxvalue": "5",
      "xaxisminvalue": "1",
      "bgcolor": "F5F5F5",
      "legendshadow": "0",
      "legendborderalpha": "0",
      "canvasborderthickness": "1",
      "canvasborderalpha": "30",
      "divlinealpha": "10",
      "showregressionline": "1",
      "yaxisminvalue": "-6",
      "yaxismaxvalue": "6",
      "animation": "1",
      "showborder": "1"
    },
    "categories": [
      {
        "verticallinethickness": "1",
        "verticallinealpha": "10",
        "category": [
          {
            "label": "1",
            "x": "1",
            "showverticalline": "1"
          },
          {
            "label": "2",
            "x": "2",
            "showverticalline": "1"
          },
          {
            "label": "3",
            "x": "3",
            "showverticalline": "1"
          },
          {
            "label": "4",
            "x": "4",
            "showverticalline": "1"
          },
          {
            "label": "5",
            "x": "5",
            "showverticalline": "1"
          }
        ]
      }
    ],
    "dataset": [
      {
        "seriesname": "Movies",
        "color": "#f8bd19",
        "anchorbgcolor": "#f8bd19 ",
        "plotborderthickness": "2",
        "showplotborder": "1",
        "anchorsides": "3",
        "data": movieDataObjects
      }
    ]
  };

  $scope.moviePieData = {
    "chart": {
      "caption": "Count of Movie Ratings with Average Sentiment Between 0.0 and 1.0",
      "bgcolor": "F5F5F5",
      "showvalues": "1",
      "showpercentvalues": "1",
      "showborder": "1",
      "showplotborder": "0",
      "showlegend": "1",
      "legendborder": "0",
      "legendposition": "bottom",
      "enablesmartlabels": "1",
      "use3dlighting": "0",
      "showshadow": "0",
      "legendbgcolor": "#CCCCCC",
      "legendbgalpha": "20",
      "legendborderalpha": "0",
      "legendshadow": "0",
      "legendnumcolumns": "3",
      "palettecolors": "#f8bd19,#e44a00,#008ee4"
    },
    "data": pieDataObjects
  };

  //array that holds the options for the "status by features" chart
  $scope.lmmpFeatures = [{
    "id": 1,
    "name": "Sun Angle"
  },{
    "id": 2,
    "name": "Crater Check"
  }, {
    "id": 3,
    "name": "Rock Detector"
  }
  ];

  //array that holds the options for the "status by calls" chart
  $scope.featureCalls = [{
    "id": 1,
    "name": "http://pub.lmmp.nasa.gov:8083/getAzElfromT1/"
  },{
    "id": 2,
    "name": "http://pub.lmmp.nasa.gov:8083/crossdomain.xml"
  }, {
    "id": 3,
    "name": "http://50.18.111.140/crossdomain.xml"
  }
  ];
});




