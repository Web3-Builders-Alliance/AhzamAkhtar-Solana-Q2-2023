use std::env;

pub fn run() {
    let args : Vec<String> = env::args().collect();

    // grabbing the input
    let command = args[1].clone();
    //

    let name = "Brad";
    let status = "100%";

    println!("Args : {:?}", args);

    println!("Command : {}" , command);

    if command == "hello" {
        println!("Hi {} , how are you dd" , name);
    } else if command == "status" {
        println!("Stauts is {}",status);
    } else {
        println!("That is not a valid command");
    }
}