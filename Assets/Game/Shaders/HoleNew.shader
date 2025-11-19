Shader "Custom/HoleTestttt"
{
	Properties{
		_Color("Main Color", Color) = (1,1,1,0)
	}
		SubShader{
			Tags { "RenderType" = "Opaque" "Queue" = "Geometry+2"}

			ColorMask RGB
			Cull Front
			ZTest Always
			Stencil {
				Ref 1
				Comp notequal
			}

			CGPROGRAM
			#pragma surface surf NoLighting
			float4 _Color;

			struct Input {
				float4 color : COLOR;
			};

			void surf(Input IN, inout SurfaceOutput o) {
				o.Albedo = _Color.rgb;
				o.Normal = half3(0,0,-1);
				o.Alpha = 1;
			}

			fixed4 LightingNoLighting(SurfaceOutput s, fixed3 lightDir, fixed atten)
			 {
				 fixed4 c;
				 c.rgb = s.Albedo; 
				 c.a = s.Alpha;
				 return c;
			 }

			ENDCG
	}
}