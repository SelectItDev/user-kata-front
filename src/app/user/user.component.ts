import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../domain/user';
import { UserService } from '../services/userservice';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [ConfirmationService, MessageService, UserService]
})
export class UserComponent implements OnInit {

    userDialog: boolean;
    users: User[];
    user: User;

    // Error variables
    notValidFormError: boolean = false;
    existingEmailError: boolean = false;
    notValidEmailError: boolean = false;

    emailRegex: RegExp = /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/;

    constructor(private userService: UserService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.userService.getUsers().subscribe(data => this.users = data);
    }

    openNew() {
        this.user = {};
        this.userDialog = true;
    }

    editUser(user: User) {
        this.user = {...user};
        this.userDialog = true;
    }

    deleteUser(user: User) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer l\'utilisateur \'' + user.firstName + ' ' + user.lastName + '\' ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deleteUser(user.id).subscribe(
                    data => {
                    this.user = {};
                        this.users = this.users.filter(val => val.id !== user.id);
                        this.messageService.add({severity:'success', summary: 'Succès', detail: 'Utilisateur a été supprimé avec succès !', life: 3000});
                    },
                    error => {
                        this.messageService.add({severity:'error', summary: 'Erreur', detail: 'Il y a eu un problème lors de la suppression de l\'Utilisateur !', life: 3000});
                    },
                    () => {

                    }
                );
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
    }

    isValidForm(){
        this.notValidFormError = !this.user.lastName || !this.user.firstName || !this.user.email;
        return !this.notValidFormError;
    }

    isValidEmail(){
        this.notValidEmailError = !this.emailRegex.test(this.user.email);
        return !this.notValidEmailError;
    }

    saveUser() {
        if(!this.isValidForm()){
            return;
        }
        if (!this.user.id) {
            if(!this.isValidEmail()){
                this.messageService.add({severity:'error', summary: 'Erreur !', detail: 'L\'email n\'est pas valide !', life: 3000});
                return;
            }
            this.userService.findUserByEmail(this.user.email).subscribe(
                data => {
                    if(data){
                        this.messageService.add({severity:'error', summary: 'Erreur !', detail: 'L\'email Existe déjà en base !', life: 3000});
                        this.existingEmailError = true;
                    } else {
                        this.existingEmailError = false;
                        this.addUser();
                    }
                },
                error => console.log(error),
                () => {}
            );
        } else {
            this.updateUser();
        }

    }

    addUser() {
        this.userService.saveUser(this.user).subscribe(
            data => {
                this.user = data;
                this.users = [...this.users, this.user];
                this.userDialog = false;
                this.user = {};
                this.messageService.add({severity:'success', summary: 'Succès', detail: 'L\'tilisateur a été créé avec succès !', life: 3000});
            },
            error => {
                this.messageService.add({severity:'error', summary: 'Erreur', detail: 'Il ya eu un problème lors de la création de l\'tilisateur !', life: 3000});
            },
            () => {}
        );
    }

    updateUser() {
        this.userService.saveUser(this.user).subscribe(
            data => {
                this.user = data;
                this.users[this.findIndexById(this.user.id)] = this.user;
                this.users = [...this.users];
                this.userDialog = false;
                this.user = {};
                this.messageService.add({severity:'success', summary: 'Succès', detail: 'L\'tilisateur a été modifié avec succès !', life: 3000});
            },
            error => {
                this.messageService.add({severity:'error', summary: 'Erreur', detail: 'Il ya eu un problème lors de la modification de l\'tilisateur !', life: 3000});
            },
            () => {}
        );
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }
}
