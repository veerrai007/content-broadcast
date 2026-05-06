'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import authService from '@/services/authservice';
import { useRouter } from 'next/navigation';


