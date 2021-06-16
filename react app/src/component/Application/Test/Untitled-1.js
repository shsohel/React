const { all } = require( "micromatch" );
const { setMaxListeners } = require( "node-notifier" );

I want to return true and false compaired two array:

First Array Here: 

const permissionsArray:[
    {
      "groupName": "User",
      "permissions": [
        "Permissions.Users.View",
        "Permissions.Users.Create",
        "Permissions.Users.Edit",
        "Permissions.Users.Delete"
        ]
      },
          {
      "groupName": "Role",
      "permissions": [
        "Permissions.Roles.View",
        "Permissions.Roles.Create",
        "Permissions.Roles.Edit",
        "Permissions.Roles.Delete"
        ]
      },

] 

Second Array Here: 
const userPermissionArray: 
   {
    "id": "cdfda4d3-ea1a-4662-a611-2d2e52b772b0",
    "name": "ABP Manager",
    "description": "ABP Manager",
    "usersCount": 4,
    "isActive": false,
    "permissions": [
      "Permissions.Users.View",
        "Permissions.Users.Create",
        "Permissions.Users.Edit",
        "Permissions.Users.Delete"
    ]
  }

  After all, I want to campaired with [permissionsArray.permissions] and [userPermissionArray.permissions]. 

  I tried , but I failed . My code here: 

  console.log(
    userPermissionArray.permissions.map(roleItem => roleItem === userPermissionArray.map(item => item.permissions.map(item => item)))
  );

  I was trying to 'true' and 'false'. If possible, please help me brother or sister.