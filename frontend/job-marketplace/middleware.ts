import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

interface Role {
    role: string;
    id: number | null;
    email: string | null;
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('refresh_token')?.value;
    const response = NextResponse.next();

    if(request.nextUrl.pathname === '/profile' && !token){
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if(request.nextUrl.pathname === '/login' && token || request.nextUrl.pathname === '/register' && token) {
        return NextResponse.redirect(new URL('/profile', request.url));
    }

    if(request.nextUrl.pathname === '/candidates/create' || request.nextUrl.pathname.startsWith('/candidates/edit/')){
        if(!token) return NextResponse.redirect(new URL('/candidates', request.url));
    
        const role = jwtDecode<Role>(token).role;
    
        if (role !== "CANDIDATE") return NextResponse.redirect(new URL('/candidates', request.url));
    
        return NextResponse.next();
    }

    if(request.nextUrl.pathname === '/jobs/create' || request.nextUrl.pathname.startsWith('/jobs/edit/')){
        if(!token) return NextResponse.redirect(new URL('/jobs', request.url));
    
        const role = jwtDecode<Role>(token).role;
    
        if (role !== "RECRUITER") return NextResponse.redirect(new URL('/jobs', request.url));
    
        return NextResponse.next();
    }

    if(request.nextUrl.pathname === '/company/create' || request.nextUrl.pathname.startsWith('/company/edit/')){
        if(!token) return NextResponse.redirect(new URL('/jobs', request.url));
    
        const role = jwtDecode<Role>(token).role;
    
        if (role !== "RECRUITER") return NextResponse.redirect(new URL('/candidates', request.url));
    
        return NextResponse.next();
    }
}
