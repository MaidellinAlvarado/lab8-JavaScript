class Usuario {
    constructor(nombre, apellido, correo, puesto, curso = [], mensaje = []) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.puesto = puesto;
        this.curso = curso;  
        this.mensaje = mensaje;  
    }

    addCourse(nombreCurso, nivel) {
        const CursoAgregado = { nombre: nombreCurso, nivel: nivel };
        this.curso.push(CursoAgregado);
    }

    removeCurso(nombreCurso) {
        const cursoEliminar = this.curso.findIndex(curso => curso.nombre === nombreCurso);
        if (cursoEliminar !== -1) {
            this.curso.splice(cursoEliminar, 1);
        }
    }

    editCurso(nombreCurso, nuevoNombre, nuevoNivel) {
        const cursoEditar = this.curso.find(curso => curso.nombre === nombreCurso);

        if (!cursoEditar) {
            console.log("Curso no encontrado");
            return;
        } else {
            cursoEditar.nombre = nuevoNombre || cursoEditar.nombre;
            cursoEditar.nivel = nuevoNivel || cursoEditar.nivel;
        }
    }

    enviarMensaje(from, men) {
        this.mensaje.push({ from, men, timestamp: new Date() });
        this.desdeCorreo(from, this.correo, men);
    }

    desdeCorreo(from, para, men) {
        console.log(`Este mensaje ha sido enviado por ${from} a ${para}: "${men}"`);
    }

    showMessagesHistory() {
        console.log("Historial de mensajes:");
        this.mensaje.forEach(({ from, message, timestamp }, index) => {
            console.log(`${index + 1}. De: ${from} - "${message}" - ${timestamp}`);
        });
    }
}

class ExtendedUser {
    static match(profesor, estudiante, nombreCurso) {
        if (!nombreCurso) {
            const matches = [];
            estudiante.curso.forEach(studentCourse => {
                profesor.curso.forEach(teacherCourse => {
                    if (studentCourse.nombre === teacherCourse.nombre && studentCourse.nivel <= teacherCourse.nivel) {
                        matches.push({ course: studentCourse.nombre, level: studentCourse.nivel });
                    }
                });
            });
            return matches;
        }

        const courseMatch = profesor.curso.find(course => 
            course.nombre === nombreCurso && 
            estudiante.curso.some(stuCourse => 
                stuCourse.nombre === nombreCurso && stuCourse.nivel <= course.nivel));

        return courseMatch ? { course: courseMatch.nombre, level: courseMatch.nivel } : undefined;
    }
}



//LABORATORIO 8 

class Tutoring {
    constructor() {
        this.alumnos = [];  
        this.profesores = []; 
    }

    addStudent(nombre, apellido, correo) {
        const newStudent = new Usuario(nombre, apellido, correo, 'estudiante');
        this.alumnos.push(newStudent);
    }

    addTeacher(nombre, apellido, correo) {
        const newTeacher = new Usuario(nombre, apellido, correo, 'profesor');
        this.profesores.push(newTeacher);
    }

    getStudentByName(nombre, apellido) {
        return this.alumnos.find(student => student.nombre === nombre && student.apellido === apellido);
    }

    getTeacherByName(nombre, apellido) {
        return this.profesores.find(teacher => teacher.nombre === nombre && teacher.apellido === apellido);
    }

    getStudentsForTeacher(teacher) {
        return this.alumnos.filter(student => {
            return ExtendedUser.match(teacher, student).length > 0;
        });
    }

    getTeacherForStudent(student) {
        return this.profesores.filter(teacher => {
            return ExtendedUser.match(teacher, student).length > 0;
        });
    }
}

// Crear instancias y pruebas
let student1 = new Usuario('Rafael', 'Fife', 'rfife@rhyta.com', 'estudiante');
let student2 = new Usuario('Kelly', 'Estes', 'k_estes@dayrep.com', 'estudiante');
let teacher1 = new Usuario('Paula', 'Thompkins', 'PaulaThompkins@jourrapide.com', 'profesor');

// Asignar cursos
student1.addCourse('maths', 2);
student1.addCourse('physics', 4);
teacher1.addCourse('maths', 4);

// Buscar coincidencias
let match = ExtendedUser.match(teacher1, student1);
console.log(match); // -> [{course: 'maths', level: 2}]
teacher1.editCurso('maths', 'maths', 1);
match = ExtendedUser.match(teacher1, student1);
console.log(match); // -> []
teacher1.addCourse('physics', 4);
match = ExtendedUser.match(teacher1, student1, 'physics');
console.log(match); // -> {course: 'physics', level: 4}
