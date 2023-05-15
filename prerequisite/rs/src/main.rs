mod print;
mod vars;
mod types;
mod tuples;
mod array;
mod vectors;
mod functions;
mod structs;
mod cli;
mod enums;
fn main() {
    // print::run();
    // vars::run();
    // types::run();
    // tuples::run();
    // array::run();
    // vectors::run();
    //functions::run();
    //structs::run();
    //enums::run();
    cli::run();
    println!("Hello, world!");

    // cannot directly print integers
    //println!(1)

    //Basic Formatting
    println!("{}",1);
    println!("Number : {}",1);
    println!("{} is from {}","Brad","Mass");

    // Positional Arguments
    println!(
        "{0} is from {1} and {0} likes to {2}",
        "Brad" , "Mass" , "code"
    );

    //Named Arguments
     println!(
        "{name} likes to play {activity}",
        name = "John",
        activity = "Baseball"
     );

     // PlaceHolder traits
     println!(
        "Binary : {:b} Hex : {:x} Octal : {:o}" , 10,10,10
    );

    // PLaceholder for debug traits
    println!("{:?}" , (12,true,"Hello"));

    // Basic Maths
    println!("10 + 10 = {}",10+10);
}
