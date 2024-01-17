import { Router } from "express";
import userMoedel from "../dao/models/user.model.js";

const router = Router();





//Register

router.post('/register', async (req, res)=>{
    const {first_name, last_name, email, age, password} = req.body;
    console.log(req.body);
    //validar que el usuario exista
    const exist = await userMoedel.findOne({ email });
    if(exist){
        return res.status(400).send({status:"error", message:"el usuario ya existe!"})
    }
    const user = {
        first_name, 
        last_name, 
        email, 
        age, 
        password //se encripta despues
    }
    const result = await userMoedel.create(user);
    res.send({status:"success", message:"Usuario creado con existo con ID"+ result.id});
})




//LogIn
router.post('/login', async (req, res)=>{
const { email, password } = req.body
const user = await userMoedel.findOne({email, password});
if(!user){return res.status(401).send({status:"error", error:"Credenciales incorrectas"})};


req.session.user =  {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    age: user.age,
                    role: user.role,
                    }
    res.send({status:"success", payload:req.session.user, message:"!primer logueo realizado! :)"});

})


//Logout
router.post('/logout', (req, res) => {
    // Elimina la sesión del usuario
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al desloguear:", err);
            return res.status(500).send({ status: "error", message: "Error al desloguear" });
        }
        res.send({ status: "success", message: "Sesión cerrada exitosamente" });
    });
});


export default router;