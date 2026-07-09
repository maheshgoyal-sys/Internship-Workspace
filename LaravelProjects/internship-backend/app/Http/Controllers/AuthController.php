<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'=>'required|email',
            'password'=>'required'
        ]);

        $user = User::where('email',$request->email)->first();

        if(!$user){
            return response()->json([
                "success"=>false,
                "message"=>"Invalid Email"
            ],401);
        }

        if(!Hash::check($request->password,$user->password)){
            return response()->json([
                "success"=>false,
                "message"=>"Invalid Password"
            ],401);
        }

        return response()->json([
            "success"=>true,
            "message"=>"Login Successful",
            "user"=>$user
        ]);
    }

    public function logout()
    {
        return response()->json([
            "success"=>true,
            "message"=>"Logout Successful"
        ]);
    }
}