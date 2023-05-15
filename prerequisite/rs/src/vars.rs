// Variables hold primitive data or references to data
// Variables are immutable by default
// Rust is a block-scoped language

pub fn run () {
    let name = "Ahzam";

    //let age = 37
    //age = 46; (
    //     doing this will cause an error 
    //      to change it , you have to make it mut
    // )

    let mut age = 37;
    age = 47;
    println!(
        "My name is {} and I am {}",name,age
    );

    // Defing constant
    const ID:i32 = 001;
    println!("ID : {}",ID);

    // Assign multiple vars
    let (my_name , my_age) = ("Brad",36);
    println!("{} is {}",my_name,my_age);

}