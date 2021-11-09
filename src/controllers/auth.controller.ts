import coalitionModel from '@/models/coalitions.model';
import scanedStudentModel from '@/models/scaned-students.model';
import studentModel from '@/models/students.model';
import { Request, Response } from 'express';
const Str = require('@supercharge/strings');
//import cryptoRandomString from 'crypto-random-string';

import fetch from 'isomorphic-fetch';

class AuthController {
  private Student = studentModel;
  private Coalition = coalitionModel;
  private ScanedStudent = scanedStudentModel;

  public authenticate = async (req: Request, res: Response) => {
    res.redirect(
      `https://api.intra.42.fr/oauth/authorize?client_id=77aae966bcf30aa1891a762725ff7ffc3715f29ebc8865884c70083af995d2c2&redirect_uri=http://127.0.0.1:5000/oauth2/redirect&response_type=code`,
    );
  };

  public callbackRedirect = async (req: Request, res: Response) => {
    const code: string = (Array.isArray(req.query.code) ? req.query.code[0] : req.query.code) as string;

    try {
      await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        headers: {
          // Check what headers the API needs. A couple of usuals right below
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: '77aae966bcf30aa1891a762725ff7ffc3715f29ebc8865884c70083af995d2c2',
          client_secret: 'abbc19357de6a28b4108d325b7abb4a6d17f74baa24bc7dfae7c2bcdddd31eaa',
          code: code,
          redirect_uri: `http://127.0.0.1:5000/oauth2/redirect`,
        }),
      })
        .then(resp => resp.json())
        .then(async data => {
          const access_token = data.access_token;

          const new_data = await fetch('https://api.intra.42.fr/v2/me', {
            method: 'GET',
            headers: {
              // Check what headers the API needs. A couple of usuals right below
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          }).then(resp => resp.json());

          const student = await this.handleStudentAuthentication(
            { intra_id: new_data.id, name: new_data.displayname, image_url: new_data.image_url, login: new_data.login },
            access_token,
          );
          res.redirect(`/password/${student.intra_id}`);
        });
    } catch (error) {
      console.error(error);
      res.send('hello world');
    }
  };

  public callback = async (req: Request, res: Response) => {
    const code: string = (Array.isArray(req.query.code) ? req.query.code[0] : req.query.code) as string;

    try {
      await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        headers: {
          // Check what headers the API needs. A couple of usuals right below
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: '77aae966bcf30aa1891a762725ff7ffc3715f29ebc8865884c70083af995d2c2',
          client_secret: 'abbc19357de6a28b4108d325b7abb4a6d17f74baa24bc7dfae7c2bcdddd31eaa',
          code: code,
          redirect_uri: `http://127.0.0.1:5000/oauth2/redirect`,
        }),
      })
        .then(resp => resp.json())
        .then(async data => {
          const access_token = data.access_token;

          const new_data = await fetch('https://api.intra.42.fr/v2/me', {
            method: 'GET',
            headers: {
              // Check what headers the API needs. A couple of usuals right below
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          }).then(resp => resp.json());

          res.status(200).json({
            success: true,
            data: await this.handleStudentAuthentication(
              { intra_id: new_data.id, name: new_data.displayname, image_url: new_data.image_url, login: new_data.login },
              access_token,
            ),
          });
        });
    } catch (error) {
      console.error(error);
      res.status(406).json({ success: false, error: 'invalid data' });
    }
  };

  private handleStudentAuthentication = async (data: any, token: string) => {
    try {
      const student = await this.Student.findOne({ intra_id: data.intra_id }).populate('coalition');
      if (student) return student;

      const response = await fetch(`https://api.intra.42.fr/v2/users/${data.intra_id}/coalitions_users`, {
        method: 'GET',
        headers: {
          // Check what headers the API needs. A couple of usuals right below
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const current_body = await response.json();

        const coalition = await this.Coalition.findOne({ intra_id: current_body[0].coalition_id });
        if (coalition) {
          const student = new this.Student({
            login: data.login,
            name: data.name,
            pass: Str.random(15), //cryptoRandomString({ length: 15, type: 'ascii-printable' }),
            image_url: data.image_url,
            flag_priority: 1,
            intra_id: data.intra_id,
            connections: 0,
            points: 0,
          });
          await student.save();
          if (Array.isArray(coalition.students)) coalition.students.push(student);
          else coalition.students = [student];
          await coalition.save();
          student.coalition = coalition;
          await student.save();
          const scaned = new this.ScanedStudent({ student: student });
          await scaned.save();
          return student;
        } else {
          return await fetch(`https://api.intra.42.fr/v2/coalitions/${current_body[0].coalition_id}`, {
            method: 'GET',
            headers: {
              // Check what headers the API needs. A couple of usuals right below
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }).then(async resp => {
            const coalition_data = await resp.json();

            const new_coalition = new this.Coalition({
              name: coalition_data.name,
              intra_id: coalition_data.id,
              image_url: coalition_data.image_url,
              color: coalition_data.color,
              cover_url: coalition_data.cover_url,
              points: 0,
            });
            await new_coalition.save();
            const new_student = new this.Student({
              login: data.login,
              name: data.name,
              image_url: data.image_url,
              intra_id: data.intra_id,
              pass: Str.random(15), //cryptoRandomString({ length: 15, type: 'ascii-printable' }),
              connections: 0,
              flag_priority: 1,
              points: 0,
            });
            if (Array.isArray(new_coalition.students)) new_coalition.students.push(new_student);
            else new_coalition.students = [new_student];
            await new_coalition.save();
            new_student.coalition = new_coalition;
            await new_student.save();
            const scaned = new this.ScanedStudent({ student: new_student });
            await scaned.save();
            return new_student;
          });
        }
      }
    } catch (error) {
      console.error('An unexpected error has occured:', error);
      throw error;
    }
  };
}

export default AuthController;
