!function(){function e(e){return $.list.contains(users,e,0)}function s(e){return e.equalsIgnoreCase($.botName)}function r(e){return e.equalsIgnoreCase($.ownerName)||e.equalsIgnoreCase($.botName)}function n(e){return 0==$.getUserGroupId(e)||$.isOwner(e)||$.isBot(e)}function o(e){return $.getUserGroupId(e)<=1||$.isOwner(e)||$.isBot(e)}function t(e){return $.getUserGroupId(e)<=2||$.isOwner(e)||$.isBot(e)}function u(e,s){return $.isAdmin(e)||null!=s&&"{}"!=s&&s.get("user-type").equalsIgnoreCase("mod")||$.isMod(e)}function a(e){var s;for(s in R)if(R[s][0].equalsIgnoreCase(e))return!0;return e in j}function g(e){for(var s in R)if(R[s][0].equalsIgnoreCase(e))return!0;return!1}function p(e){return e in j}function d(e,s){return null!=s&&"{}"!=s&&s.get("subscriber").equalsIgnoreCase("1")||$.isSub(e)}function l(e){return null!=e&&"{}"!=e&&e.get("turbo").equalsIgnoreCase("1")||!1}function f(e){return 4==$.getUserGroupId(e)}function b(e){return 5==$.getUserGroupId(e)}function m(e){return $.getUserGroupId(e)<=6||$.isOwner(e)||$.isBot(e)}function c(e){return $.list.contains(T,e.toLowerCase(),0)}function w(e){return $.list.contains(modListUsers,e.toLowerCase())}function I(e){return e=e.toLowerCase(),$.inidb.exists("group",e)?parseInt($.inidb.get("group",e)):7}function C(e){return $.getGroupNameById($.getUserGroupId(e))}function h(e){return e=parseInt(e),$.inidb.exists("groups",e)?$.inidb.get("groups",e):A[7]}function S(e){var s;for(s=0;s<A.length;s++)if(A[s].equalsIgnoreCase(e.toLowerCase()))return s;return 7}function y(e){return parseInt($.inidb.get("grouppoints",$.getUserGroupName(e)))}function L(e,s){$.userExists(e.toLowerCase())&&$.inidb.set("group",e.toLowerCase(),s)}function v(e,s){$.setUserGroupById(e,$.getGroupIdByName(s))}function x(){var e,s=$.inidb.GetKeyList("groups","");A=[];for(e in s)A[parseInt(s[e])]=$.inidb.get("groups",s[e])}function U(e){var s,r=[];for(s in users)e?$.getUserGroupId(users[s][0])<=e&&r.push(users[s][0]):r.push(users[s][0]);return r}function G(e){return e.toLowerCase()in j?j[e]:0}function D(e,s){j[e]=s}function M(e){delete j[e]}function N(e){e=(e+"").toLowerCase();for(i in R)if(R[i][0].equalsIgnoreCase(e))return;R.push([e,$.systemTime()+1e4])}function P(e){var s=[];e=(e+"").toLowerCase();for(i in R)R[i][0].equalsIgnoreCase(e)||s.push([R[i][0],R[i][1]]);R=s}function q(e,s){if(e=(e+"").toLowerCase(),$.bot.isModuleEnabled("./handlers/subscribeHandler.js")||$.bot.isModuleEnabled("./handlers/gameWispHandler.js")){if($.isMod(e)||$.isAdmin(e))return;s&&($.getIniDbBoolean("subscribed",e,!1)&&!g(e)?$.setIniDbBoolean("subscribed",e,!1):!$.getIniDbBoolean("subscribed",e,!1)&&g(e)&&$.setIniDbBoolean("subscribed",e,!0)),$.getIniDbBoolean("gamewispsubs",e,!1)&&!p(e)?($.setIniDbBoolean("gamewispsubs",e,!1),$.inidb.set("gamewispsubs",e+"_tier",1)):!$.getIniDbBoolean("gamewispsubs",e,!1)&&p(e)&&($.setIniDbBoolean("gamewispsubs",e,!0),$.inidb.set("gamewispsubs",e+"_tier",G(e))),(g(e)||p(e))&&3!=I(e)&&($.inidb.set("preSubGroup",e,I(e)),v(e,"Subscriber")),s&&(g(e)||p(e)||3!=I(e)||($.inidb.exists("preSubGroup",e)?($.inidb.set("group",e,$.inidb.get("preSubGroup",e)),$.inidb.del("preSubGroup",e)):$.inidb.set("group",e,7)))}}function B(){$.getSetIniDbString("grouppoints","Caster","-1"),$.getSetIniDbString("grouppointsoffline","Caster","-1"),$.getSetIniDbString("grouppoints","Administrator","-1"),$.getSetIniDbString("grouppointsoffline","Administrator","-1"),$.getSetIniDbString("grouppoints","Moderator","-1"),$.getSetIniDbString("grouppointsoffline","Moderator","-1"),$.getSetIniDbString("grouppoints","Subscriber","-1"),$.getSetIniDbString("grouppointsoffline","Subscriber","-1"),$.getSetIniDbString("grouppoints","Donator","-1"),$.getSetIniDbString("grouppointsoffline","Donator","-1"),$.getSetIniDbString("grouppoints","Hoster","-1"),$.getSetIniDbString("grouppointsoffline","Hoster","-1"),$.getSetIniDbString("grouppoints","Regular","-1"),$.getSetIniDbString("grouppointsoffline","Regular","-1"),$.getSetIniDbString("grouppoints","Viewer","-1"),$.getSetIniDbString("grouppointsoffline","Viewer","-1")}function O(){A[0]&&"Caster"==A[0]||(A[0]="Caster",$.inidb.set("groups","0","Caster")),A[1]&&"Administrator"==A[1]||(A[1]="Administrator",$.inidb.set("groups","1","Administrator")),A[2]&&"Moderator"==A[2]||(A[2]="Moderator",$.inidb.set("groups","2","Moderator")),A[3]&&"Subscriber"==A[3]||(A[3]="Subscriber",$.inidb.set("groups","3","Subscriber")),A[4]&&"Donator"==A[4]||(A[4]="Donator",$.inidb.set("groups","4","Donator")),A[5]&&"Hoster"==A[5]||(A[5]="Hoster",$.inidb.set("groups","5","Hoster")),A[6]&&"Regular"==A[6]||(A[6]="Regular",$.inidb.set("groups","6","Regular")),A[7]&&"Viewer"==A[7]||(A[7]="Viewer",$.inidb.set("groups","7","Viewer")),$.inidb.set("group",$.ownerName.toLowerCase(),0)}var A=[],T=[],R=[],j=[];modListUsers=[],users=[],lastJoinPart=$.systemTime(),$.bind("ircJoinComplete",function(e){var s,r=e.getChannel().getNicks().iterator();for(lastJoinPart=$.systemTime();r.hasNext();)s=r.next().toLowerCase(),$.userExists(s)||(users.push([s,$.systemTime()]),$.checkGameWispSub(s))}),$.bind("ircChannelJoinUpdate",function(e){var s=e.getUser().toLowerCase();$.user.isKnown(s)||$.setIniDbBoolean("visited",s,!0),lastJoinPart=$.systemTime(),$.userExists(s)||(users.push([s,$.systemTime()]),$.checkGameWispSub(s))}),$.bind("ircChannelJoin",function(e){var s=e.getUser().toLowerCase();$.user.isKnown(s)||$.setIniDbBoolean("visited",s,!0),lastJoinPart=$.systemTime(),$.userExists(s)||(users.push([s,$.systemTime()]),$.checkGameWispSub(s))}),$.bind("ircChannelLeave",function(e){var s,r=e.getUser().toLowerCase();for(s in users)users[s][0].equalsIgnoreCase(r)&&(users.splice(s,1),q(r,!0))}),$.bind("ircChannelUserMode",function(e){var s,r=e.getUser().toLowerCase();if(e.getMode().equalsIgnoreCase("o"))if(e.getAdd().toString().equals("true"))$.hasModeO(r)||($.isOwner(r)?(T.push([r,0]),$.inidb.set("group",r,0)):$.isAdmin(r)?(T.push([r,1]),$.inidb.set("group",r,1)):(T.push([r,2]),$.inidb.set("group",r,2)));else if($.hasModeO(r)){var i=[];for(s in T)T[s][0].equalsIgnoreCase(r)||i.push([T[s][0],T[s][1]]);T=i,a(r)?v(r,"Subscriber"):v(r,"Regular")}}),$.bind("ircPrivateMessage",function(e){var r,i,n=e.getSender().toLowerCase(),t=e.getMessage().toLowerCase().trim(),u="the moderators of this room are: ",a=$.inidb.GetKeyList("group",""),g=[];if(n.equalsIgnoreCase("jtv")){if(t.indexOf(u)>-1){r=t.replace(u,"").split(", "),modListUsers=[];for(i in a)$.inidb.get("group",a[i]).equalsIgnoreCase("2")&&$.inidb.del("group",a[i]);for(i in r)modListUsers.push(r[i]),o(r[i])||s(r[i])||$.inidb.set("group",r[i],"2");$.saveArray(modListUsers,"addons/mods.txt",!1)}if(t.indexOf("specialuser")>-1&&(r=t.split(" "),r[2].equalsIgnoreCase("subscriber"))){for(i in R)if(R[i][0].equalsIgnoreCase(r[1]))return void(R[i][1]=$.systemTime()+1e4);R.push([r[1],$.systemTime()+1e4]),q(r[1].toLowerCase(),!0);for(i in R)g.push(R[i][0]);$.saveArray(g,"addons/subs.txt",!1)}}}),$.bind("command",function(e){var s=e.getSender().toLowerCase(),r=e.getCommand(),i=e.getArgs();if(r.equalsIgnoreCase("users")&&(users.length>20?$.say($.whisperPrefix(s)+$.lang.get("permissions.current.listtoolong",users.length)):$.say($.whisperPrefix(s)+$.lang.get("permissions.current.users",U().join(", ")))),r.equalsIgnoreCase("mods")){var n=U(2);n.length>20?$.say($.whisperPrefix(s)+$.lang.get("permissions.current.listtoolong",n.length)):$.say($.whisperPrefix(s)+$.lang.get("permissions.current.mods",n.join(", ")))}if(r.equalsIgnoreCase("group")){if(!$.isModv3(s,e.getTags())||!i[0])return void $.say($.whisperPrefix(s)+$.lang.get("permissions.group.self.current",$.getUserGroupName(s)));var o=i[0],t=parseInt(i[1]);if(i.length<2||isNaN(t)||$.outOfRange(t,0,A.length-1))return void $.say($.whisperPrefix(s)+$.lang.get("permissions.group.usage"));if(!$.isOwner(s)&&t<$.getUserGroupId(s))return void $.say($.whisperPrefix(s)+$.lang.get("permissions.group.set.error.abovegroup"));if(!$.isOwner(s)&&t==$.getUserGroupId(s))return void $.say($.whisperPrefix(s)+$.lang.get("permissions.group.set.error.samegroup"));$.inidb.set("group",o.toLowerCase(),t),$.say($.whisperPrefix(s)+$.lang.get("permissions.group.set.success",$.username.resolve(o),h(t)+" ("+t+")"))}if(r.equalsIgnoreCase("grouppoints")){var t,u,a;if(!i[0])return void $.say($.whisperPrefix(s)+$.lang.get("permissions.grouppoints.usage"));if(t=parseInt(i[0]),isNaN(t)||$.outOfRange(t,0,A.length-1))return void $.say($.whisperPrefix(s)+$.lang.get("permissions.grouppoints.usage"));if(!i[1])return void $.say($.whisperPrefix(s)+$.lang.get("permissions.grouppoints.showgroup",t,$.inidb.exists("grouppoints",h(t))?$.inidb.get("grouppoints",h(t)):"(undefined)",$.pointNameMultiple,$.inidb.exists("grouppointsoffline",h(t))?$.inidb.get("grouppointsoffline",h(t)):"(undefined)",$.pointNameMultiple));if(u=i[1],"online"!=u.toLowerCase()&&"offline"!=u.toLowerCase())return void $.say($.whisperPrefix(s)+$.lang.get("permissions.grouppoints.usage"));if(!i[2])return void("online"==u.toLowerCase()?$.say($.whisperPrefix(s)+$.lang.get("permissions.grouppoints.showgroup.online",t,$.inidb.exists("grouppoints",h(t))?$.inidb.get("grouppoints",h(t)):"(undefined)",$.pointNameMultiple)):"offline"==u.toLowerCase()&&$.say($.whisperPrefix(s)+$.lang.get("permissions.grouppoints.showgroup.offline",t,$.inidb.exists("grouppointsoffline",h(t))?$.inidb.get("grouppointsoffline",h(t)):"(undefined)",$.pointNameMultiple)));if(a=parseInt(i[2]),isNaN(a))return void $.say($.whisperPrefix(s)+$.lang.get("permissions.grouppoints.usage"));0>a&&(a=-1),"online"==u.toLowerCase()?($.say($.whisperPrefix(s)+$.lang.get("permissions.grouppoints.set.online",t,a,$.pointNameMultiple)),$.inidb.set("grouppoints",h(t),a)):"offline"==u.toLowerCase()&&($.say($.whisperPrefix(s)+$.lang.get("permissions.grouppoints.set.offline",t,a,$.pointNameMultiple)),$.inidb.set("grouppointsoffline",h(t),a))}}),x(),O(),B(),$.bind("initReady",function(){$.registerChatCommand("./core/permissions.js","group",7),$.registerChatCommand("./core/permissions.js","grouppoints",1),$.registerChatCommand("./core/permissions.js","users",7),$.registerChatCommand("./core/permissions.js","mods",7)}),$.casterMsg=$.lang.get("cmd.casteronly"),$.adminMsg=$.lang.get("cmd.adminonly"),$.modMsg=$.lang.get("cmd.modonly"),$.userGroups=A,$.modeOUsers=T,$.subUsers=R,$.modListUsers=modListUsers,$.users=users,$.lastJoinPart=lastJoinPart,$.userExists=e,$.isBot=s,$.isOwner=r,$.isCaster=n,$.isAdmin=o,$.isMod=t,$.isModv3=u,$.isOwner=r,$.isSub=a,$.isSubv3=d,$.isTurbo=l,$.isDonator=f,$.isHoster=b,$.isReg=m,$.hasModeO=c,$.hasModList=w,$.getUserGroupId=I,$.getUserGroupName=C,$.getGroupNameById=h,$.getGroupIdByName=S,$.getGroupPointMultiplier=y,$.setUserGroupById=L,$.setUserGroupByName=v,$.addSubUsersList=N,$.delSubUsersList=P,$.restoreSubscriberStatus=q,$.addGWSubUsersList=D,$.delGWSubUsersList=M,$.getGWTier=G}();
